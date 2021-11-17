import {
  ComponentWithProps,
  CSSPropertyInfo,
  PropertyInfo,
  PropertyValue,
  SlotValue
} from './types.js';
import {
  getTemplates,
  normalizeType,
  TemplateTypes,
  unquote,
  getTemplateNode
} from './utils.js';

export type Knobable = unknown | CSSPropertyInfo | PropertyInfo | SlotValue;

export type Knob<T extends Knobable = unknown> = T & {
  attribute: string | undefined;
  value: PropertyValue;
  custom?: boolean;
  knobType: string;
};

export interface HasKnobs {
  getKnob(name: string): { knob: Knob<PropertyInfo>; custom?: boolean };
  syncKnob(component: Element, changed: Knob<PropertyInfo>): void;
}

const getDefault = (prop: Knob<PropertyInfo>): PropertyValue => {
  const { knobType, default: value } = prop;
  switch (knobType) {
    case 'boolean':
      return value !== 'false';
    case 'number':
      return Number(value);
    default:
      return unquote(value as string);
  }
};

// TODO: remove when analyzer outputs "readOnly" to JSON
const isGetter = (
  ctor: CustomElementConstructor | undefined,
  prop: string
): boolean => {
  function getDescriptor(
    obj: CustomElementConstructor
  ): PropertyDescriptor | undefined {
    return obj === HTMLElement
      ? undefined
      : Object.getOwnPropertyDescriptor(obj.prototype, prop) ||
          getDescriptor(Object.getPrototypeOf(obj));
  }

  let result = false;
  if (ctor) {
    const descriptor = getDescriptor(ctor);
    result = Boolean(
      descriptor && descriptor.get && descriptor.set === undefined
    );
  }
  return result;
};

export const getKnobs = (
  tag: string,
  props: PropertyInfo[],
  exclude = ''
): Knob<PropertyInfo>[] => {
  // Exclude getters and specific properties
  let propKnobs = props.filter(
    ({ name }) =>
      !exclude.includes(name) && !isGetter(customElements.get(tag), name)
  ) as Knob<PropertyInfo>[];

  // Set knob types and default knobs values
  propKnobs = propKnobs.map((prop) => {
    const knob = {
      ...prop,
      knobType: normalizeType(prop.type)
    };

    if (typeof knob.default === 'string') {
      knob.value = getDefault(knob);
    }

    return knob;
  });

  return propKnobs;
};

export const getCustomKnobs = (
  tag: string,
  vid?: number
): Knob<PropertyInfo>[] => {
  return getTemplates(vid as number, tag, TemplateTypes.KNOB)
    .map((template) => {
      const { attr, type } = template.dataset;
      let result = null;
      if (attr) {
        if (type === 'select') {
          const node = getTemplateNode(template);
          const options = node
            ? Array.from(node.children)
                .filter(
                  (c): c is HTMLOptionElement => c instanceof HTMLOptionElement
                )
                .map((option) => option.value)
            : [];
          if (node instanceof HTMLSelectElement && options.length > 1) {
            result = {
              name: attr,
              attribute: attr,
              knobType: type,
              options
            };
          }
        }
        if (type === 'string' || type === 'boolean') {
          result = {
            name: attr,
            attribute: attr,
            knobType: type
          };
        }
      }
      return result as Knob<PropertyInfo>;
    })
    .filter(Boolean);
};

export const getInitialKnobs = (
  propKnobs: Knob<PropertyInfo>[],
  component: HTMLElement
): Knob<PropertyInfo>[] => {
  return propKnobs.filter((prop) => {
    const { name, knobType } = prop;
    const defaultValue = getDefault(prop);
    return (
      (component as unknown as ComponentWithProps)[name] !== defaultValue ||
      (knobType === 'boolean' && defaultValue)
    );
  });
};
