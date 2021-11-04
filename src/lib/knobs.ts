import type {
  CssCustomProperty,
  ClassField
} from 'custom-elements-manifest/schema';

import { html, TemplateResult } from 'lit';
import { SlotValue } from './types.js';
import { normalizeType } from './utils.js';

const DEFAULT = 'default';

type Knobable = unknown | (CssCustomProperty | ClassField | SlotValue);

export type KnobType =
  | 'select'
  | 'boolean'
  | 'checkbox'
  | 'number'
  | 'text'
  | 'string';
export type Knob<T extends Knobable = unknown> = T & {
  value?: string;
  options?: string[];
  custom?: string;
  knobType?: KnobType;
} & {
  // only for member?
  attribute?: string;
};

type InputRenderer = (item: Knob, id: string) => TemplateResult;

const capitalize = (name: string): string =>
  name[0].toUpperCase() + name.slice(1);

export const getSlotDefault = (name: string, initial: string): string =>
  capitalize(name === '' ? initial : name);

export const getSlotContent = (name: string) => getSlotDefault(name, 'content');

const getInputType = (type?: string): 'checkbox' | 'number' | 'text' => {
  switch (normalizeType(type)) {
    case 'boolean':
      return 'checkbox';
    case 'number':
      return 'number';
    default:
      return 'text';
  }
};

export const cssPropRenderer: InputRenderer = (
  knob: Knob,
  id: string
): TemplateResult => {
  const { name, value } = knob as CssCustomProperty & { value?: string };

  return html`
    <input
      id=${id}
      type="text"
      .value=${String(value)}
      data-name=${name}
      part="input"
    />
  `;
};

export const propRenderer: InputRenderer = (
  knob: Knob,
  id: string
): TemplateResult => {
  const { name, knobType, type, value, options } = knob as Knob<ClassField>;
  let input;
  if (knobType === 'select' && Array.isArray(options)) {
    input = html`
      <select id=${id} data-name=${name} data-type=${knobType} part="select">
        ${options.map(
          (option) => html`<option value=${option}>${option}</option>`
        )}
      </select>
    `;
  } else if (normalizeType(knobType ?? type?.text) === 'boolean') {
    input = html`
      <input
        id=${id}
        type="checkbox"
        .checked=${Boolean(value)}
        data-name=${name}
        data-type=${knobType}
        part="checkbox"
      />
    `;
  } else {
    input = html`
      <input
        id=${id}
        type=${getInputType(knobType)}
        .value=${value == null ? '' : String(value)}
        data-name=${name}
        data-type=${knobType}
        part="input"
      />
    `;
  }
  return input;
};

export const slotRenderer: InputRenderer = (
  knob: Knob,
  id: string
): TemplateResult => {
  const { name, content } = knob as SlotValue;

  return html`
    <input
      id=${id}
      type="text"
      .value=${content}
      data-type="slot"
      data-slot=${name}
      part="input"
    />
  `;
};

export const renderKnobs = (
  items: Knob[],
  header: string,
  type: string,
  renderer: InputRenderer
): TemplateResult => {
  const rows = items.map((item: Knob) => {
    const { name } = item as Knob<ClassField>; // any type will do as we default it on next line
    const id = `${type}-${name || DEFAULT}`;
    const label = type === 'slot' ? getSlotDefault(name, DEFAULT) : name;
    return html`
      <tr>
        <td>
          <label for=${id} part="knob-label">${label}</label>
        </td>
        <td>${renderer(item, id)}</td>
      </tr>
    `;
  });

  return html`
    <h3 part="knobs-header" ?hidden=${items.length === 0}>${header}</h3>
    <table>
      ${rows}
    </table>
  `;
};
