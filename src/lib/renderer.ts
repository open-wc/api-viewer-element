import { directive, Part, NodePart } from 'lit-html';
import {
  ComponentWithProps,
  CSSPropertyInfo,
  KnobValues,
  SlotValue
} from './types.js';
import {
  getTemplate,
  getTemplateNode,
  hasTemplate,
  isTemplate,
  normalizeType,
  TemplateTypes
} from './utils.js';

const { HOST, PREFIX, SLOT, SUFFIX, WRAPPER } = TemplateTypes;

const caches = new WeakMap();

const applyKnobs = (component: Element, knobs: KnobValues): void => {
  Object.keys(knobs).forEach((key: string) => {
    const { type, attribute, value, custom } = knobs[key];
    if (custom && attribute) {
      if (typeof value === 'string' && value) {
        component.setAttribute(attribute, value);
      } else {
        component.removeAttribute(attribute);
      }
    } else if (normalizeType(type) === 'boolean') {
      component.toggleAttribute(attribute || key, Boolean(value));
    } else {
      (component as unknown as ComponentWithProps)[key] = value;
    }
  });
};

const applySlots = (component: Element, slots: SlotValue[]): void => {
  while (component.firstChild) {
    component.removeChild(component.firstChild);
  }
  slots.forEach((slot) => {
    let node: Element | Text;
    const { name, content } = slot;
    if (name) {
      node = document.createElement('div');
      node.setAttribute('slot', name);
      node.textContent = content;
    } else {
      node = document.createTextNode(content);
    }
    component.appendChild(node);
  });
};

const applyCssProps = (
  component: HTMLElement,
  cssProps: CSSPropertyInfo[]
): void => {
  cssProps.forEach((prop) => {
    const { name, value } = prop;
    if (value) {
      if (value === prop.default) {
        component.style.removeProperty(name);
      } else {
        component.style.setProperty(name, value);
      }
    }
  });
};

const isDefinedPromise = (action: unknown): action is Promise<unknown> =>
  typeof action === 'object' && Promise.resolve(action) === action;

interface PossiblyAsyncElement {
  updateComplete?: Promise<unknown>;
  componentOnReady?: () => Promise<unknown>;
}

/**
 * Awaits for "update complete promises" of elements
 * - for [lit-element](https://github.com/polymer/lit-element) that is `el.updateComplete`;
 * - for [stencil](https://github.com/ionic-team/stencil/) that is `el.componentOnReady()`;
 *
 * If none of those Promise hooks are found, it will wait for `setTimeout`.
 */
async function elementUpdated(
  element: HTMLElement
): Promise<PossiblyAsyncElement> {
  let hasSpecificAwait = false;
  const el = element as PossiblyAsyncElement;

  const litPromise = el.updateComplete;
  if (isDefinedPromise(litPromise)) {
    await litPromise;
    hasSpecificAwait = true;
  }

  const stencilPromise = el.componentOnReady ? el.componentOnReady() : false;
  if (isDefinedPromise(stencilPromise)) {
    await stencilPromise;
    hasSpecificAwait = true;
  }

  if (!hasSpecificAwait) {
    await new Promise(requestAnimationFrame);
  }

  return el;
}

const makePart = (part: NodePart): NodePart => {
  const newPart = new NodePart(part.options);
  newPart.appendIntoPart(part);
  return newPart;
};

const importTemplate = (tpl: HTMLTemplateElement): DocumentFragment =>
  document.importNode(tpl.content, true);

export const renderer = directive(
  (
      id: number,
      tag: string,
      knobs: KnobValues,
      slots: SlotValue[],
      cssProps: CSSPropertyInfo[]
    ) =>
    (part: Part) => {
      if (!(part instanceof NodePart)) {
        throw new Error('renderer can only be used in text bindings');
      }

      let component = caches.get(part);
      if (component === undefined || component.tagName.toLowerCase() !== tag) {
        const [host, prefix, suffix, slot, wrapper] = [
          HOST,
          PREFIX,
          SUFFIX,
          SLOT,
          WRAPPER
        ].map((type) => getTemplate(id, tag, type));

        const node = getTemplateNode(host);
        if (node) {
          component = node.cloneNode(true);
        } else {
          component = document.createElement(tag);
        }

        let targetPart = part;

        if (isTemplate(prefix)) {
          const prefixPart = makePart(part);
          prefixPart.setValue(importTemplate(prefix));
          prefixPart.commit();
        }

        const wrapNode = getTemplateNode(wrapper);
        if (wrapNode) {
          const wrapperPart = makePart(part);
          const clone = wrapNode.cloneNode(true) as HTMLElement;
          clone.innerHTML = '';
          wrapperPart.setValue(clone);
          wrapperPart.commit();
          const innerPart = new NodePart(part.options);
          innerPart.appendInto(clone);
          targetPart = innerPart;
        } else if (isTemplate(prefix) || isTemplate(suffix)) {
          const contentPart = makePart(part);
          targetPart = contentPart;
        }

        targetPart.setValue(component);
        targetPart.commit();

        if (isTemplate(suffix)) {
          const suffixPart = makePart(part);
          suffixPart.setValue(importTemplate(suffix));
          suffixPart.commit();
        }

        if (isTemplate(slot)) {
          component.appendChild(importTemplate(slot));
        }

        caches.set(part, component);

        const instance = targetPart.value as HTMLElement;

        // wait for rendering
        elementUpdated(instance).then(() => {
          instance.dispatchEvent(
            new CustomEvent('rendered', {
              detail: {
                component
              },
              bubbles: true,
              composed: true
            })
          );
        });
      }

      applyKnobs(component, knobs);

      if (!hasTemplate(id, tag, SLOT) && slots.length) {
        applySlots(component, slots);
      }

      if (cssProps.length) {
        applyCssProps(component, cssProps);
      }
    }
);
