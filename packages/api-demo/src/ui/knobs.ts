import { unquote, type ClassField } from '@api-viewer/common/lib/index.js';
import {
  getTemplateNode,
  getTemplates,
  TemplateTypes
} from '@api-viewer/common/lib/templates.js';
import type { ComponentWithProps, KnobValue, PropertyKnob } from '../types.js';

const getDefault = (prop: PropertyKnob): KnobValue => {
  const { knobType, default: value } = prop;
  switch (knobType) {
    case 'boolean':
      return value !== 'false';
    case 'number':
      return Number(value);
    default:
      return unquote(value);
  }
};

const normalizeType = (type: string | undefined = ''): string =>
  type.replace(' | undefined', '').replace(' | null', '');

export const getKnobs = (props: ClassField[], exclude = ''): PropertyKnob[] => {
  // Exclude getters and specific properties
  let propKnobs = props.filter(
    ({ name, readonly }) => !exclude.includes(name) && !readonly
  ) as PropertyKnob[];

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

export const getCustomKnobs = (tag: string, vid?: number): PropertyKnob[] =>
  getTemplates(vid!, tag, TemplateTypes.KNOB)
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
      return result as PropertyKnob;
    })
    .filter(Boolean);

export const getInitialKnobs = (
  propKnobs: PropertyKnob[],
  component: HTMLElement
): PropertyKnob[] =>
  propKnobs.filter((prop) => {
    const { name, knobType } = prop;
    const defaultValue = getDefault(prop);
    return (
      (component as unknown as ComponentWithProps)[name] !== defaultValue ||
      (knobType === 'boolean' && defaultValue)
    );
  });
