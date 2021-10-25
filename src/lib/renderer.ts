import { ChildPart, html, noChange, nothing, TemplateResult } from 'lit';
import { directive, Directive, PartInfo, PartType } from 'lit/directive.js';
import { templateContent } from 'lit/directives/template-content.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
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

export type ComponentRendererOptions = {
  id: number;
  tag: string;
  knobs: KnobValues;
  slots: SlotValue[];
  cssProps: CSSPropertyInfo[];
};

const { HOST, PREFIX, SLOT, SUFFIX, WRAPPER } = TemplateTypes;

const updateComponent = (
  component: HTMLElement,
  options: ComponentRendererOptions
): void => {
  const { id, tag, knobs, slots, cssProps } = options;

  // Apply knobs using properties or attributes
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

  // Apply slots content by re-creating nodes
  if (!hasTemplate(id, tag, SLOT) && slots.length) {
    component.innerHTML = '';
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
  }

  // Apply CSS props
  if (cssProps.length) {
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
  }
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

class Renderer extends Directive {
  constructor(part: PartInfo) {
    super(part);
    if (part.type !== PartType.CHILD) {
      throw new Error('renderer only supports binding to element');
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  render(_options: ComponentRendererOptions): typeof nothing {
    return nothing;
  }

  update(
    part: ChildPart,
    [options]: [ComponentRendererOptions]
  ): TemplateResult | typeof noChange {
    const parent = part.options?.host as Element;
    const { tag } = options;

    // Update existing component, if any
    let component = parent.querySelector(tag) as HTMLElement;
    if (component) {
      updateComponent(component, options);
      return noChange;
    }

    const result = [];

    const [host, prefix, suffix, slot, wrapper] = [
      HOST,
      PREFIX,
      SUFFIX,
      SLOT,
      WRAPPER
    ].map((type) => getTemplate(options.id, tag, type));

    const closing = `</${tag}>`;

    // Host template
    const node = getTemplateNode(host);

    // Prefix template
    if (isTemplate(prefix)) {
      result.push(templateContent(prefix));
    }

    // Slot template
    let raw = node ? node.outerHTML : `<${tag}>${closing}`;
    if (isTemplate(slot)) {
      raw = raw.replace(closing, `${slot.innerHTML}${closing}`);
    }

    // Wrapper template
    const wrapNode = getTemplateNode(wrapper);
    if (wrapNode) {
      const wrapTagName = wrapNode.localName;

      const wrapped = unsafeHTML(`
        <${wrapTagName}>
          ${raw}
        </${wrapTagName}>
      `);

      result.push(wrapped);
    } else {
      result.push(unsafeHTML(raw));
    }

    // Prefix template
    if (isTemplate(suffix)) {
      result.push(templateContent(suffix));
    }

    // Wait for rendering
    Promise.resolve().then(() => {
      component = parent.querySelector(tag) as HTMLElement;

      elementUpdated(component).then(() => {
        component.dispatchEvent(
          new CustomEvent('rendered', {
            detail: {
              component
            },
            bubbles: true,
            composed: true
          })
        );
      });
    });

    return html`${result}`;
  }
}

export const renderer = directive(Renderer);
