import { directive, Part, NodePart } from 'lit-html';
import {
  ComponentWithProps,
  CSSPropertyInfo,
  KnobValues,
  KnobValue,
  SlotValue
} from './types.js';
import { getTemplate, hasTemplate } from './utils.js';

const caches = new WeakMap();

const applyKnobs = (component: Element, knobs: KnobValues) => {
  Object.keys(knobs).forEach((key: string) => {
    const knob: KnobValue = knobs[key];

    if (knob.type === 'boolean') {
      if (knob.value) {
        component.setAttribute(key, '');
      } else {
        component.removeAttribute(key);
      }
    } else {
      ((component as unknown) as ComponentWithProps)[key] = knob.value;
    }
  });
};

const applySlots = (component: Element, slots: SlotValue[]) => {
  while (component.firstChild) {
    component.removeChild(component.firstChild);
  }
  slots.forEach(slot => {
    const div = document.createElement('div');
    const { name, content } = slot;
    if (name) {
      div.setAttribute('slot', name);
    }
    div.textContent = content;
    component.appendChild(div);
  });
};

const applyCssProps = (component: HTMLElement, cssProps: CSSPropertyInfo[]) => {
  cssProps.forEach(prop => {
    const { name, value } = prop;
    if (value) {
      if (value === prop.defaultValue) {
        component.style.removeProperty(name);
      } else {
        component.style.setProperty(name, value);
      }
    }
  });
};

export const renderer = directive(
  (
    tag: string,
    knobs: KnobValues,
    slots: SlotValue[],
    cssProps: CSSPropertyInfo[]
  ) => (part: Part) => {
    if (!(part instanceof NodePart)) {
      throw new Error('renderer can only be used in text bindings');
    }

    let component = caches.get(part);
    if (component === undefined || component.tagName.toLowerCase() !== tag) {
      component = document.createElement(tag);

      part.setValue(component);
      part.commit();

      const template = getTemplate(tag);
      if (template instanceof HTMLTemplateElement) {
        const clone = document.importNode(template.content, true);
        component.appendChild(clone);
      }

      caches.set(part, component);

      const instance = part.value as Element;

      // wait for rendering
      setTimeout(() => {
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

    if (!hasTemplate(tag) && slots.length) {
      applySlots(component, slots);
    }

    if (cssProps.length) {
      applyCssProps(component, cssProps);
    }
  }
);
