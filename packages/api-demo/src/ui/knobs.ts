import { ClassField, CssCustomProperty, SlotValue } from '@api-viewer/common';
import {
  getTemplates,
  TemplateTypes,
  unquote,
  getTemplateNode
} from '@api-viewer/common/lib/templates.js';

export type KnobValue = string | number | boolean | null | undefined;

export type ComponentWithProps = {
  [key: string]: KnobValue;
};

export type Knobable = unknown | (CssCustomProperty | ClassField | SlotValue);

export type Knob<T extends Knobable = unknown> = T & {
  attribute: string | undefined;
  value: KnobValue;
  custom?: boolean;
  options?: string[];
  knobType: string;
};

export interface HasKnobs {
  getKnob(name: string): { knob: Knob<ClassField>; custom?: boolean };
  syncKnob(component: Element, changed: Knob<ClassField>): void;
}

const getDefault = (prop: Knob<ClassField>): KnobValue => {
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

const normalizeType = (type: string | undefined = ''): string =>
  type.replace(' | undefined', '').replace(' | null', '');

export const getKnobs = (
  tag: string,
  props: ClassField[],
  exclude = ''
): Knob<ClassField>[] => {
  // Exclude getters and specific properties
  let propKnobs = props.filter(
    ({ name }) =>
      !exclude.includes(name) && !isGetter(customElements.get(tag), name)
  ) as Knob<ClassField>[];

  // Set knob types and default knobs values
  propKnobs = propKnobs.map((prop) => {
    const knob = {
      ...prop,
      knobType: normalizeType(prop.type?.text)
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
): Knob<ClassField>[] => {
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
      return result as Knob<ClassField>;
    })
    .filter(Boolean);
};

export const getInitialKnobs = (
  propKnobs: Knob<ClassField>[],
  component: HTMLElement
): Knob<ClassField>[] => {
  return propKnobs.filter((prop) => {
    const { name, knobType } = prop;
    const defaultValue = getDefault(prop);
    return (
      (component as unknown as ComponentWithProps)[name] !== defaultValue ||
      (knobType === 'boolean' && defaultValue)
    );
  });
};
