import { directive, Part, NodePart } from 'lit-html';
import { KnobValues, KnobValue } from './types.js';

const caches = new WeakMap();

type AnyProps = { [s: string]: string | number | boolean | null };

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
      ((component as unknown) as AnyProps)[key] = knob.value;
    }
  });
};

export const renderer = directive(
  (tag: string, knobs: KnobValues) => (part: Part) => {
    if (!(part instanceof NodePart)) {
      throw new Error('renderer can only be used in text bindings');
    }

    let component = caches.get(part);
    if (component === undefined || component.tagName.toLowerCase() !== tag) {
      component = document.createElement(tag);

      part.setValue(component);
      part.commit();

      caches.set(part, component);
    }

    applyKnobs(component, knobs);
  }
);
