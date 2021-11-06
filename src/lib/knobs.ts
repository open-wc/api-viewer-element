import { html, TemplateResult } from 'lit';
import { CSSPropertyInfo, PropertyInfo, SlotValue } from './types.js';
import { normalizeType } from './utils.js';

const DEFAULT = 'default';

type Knobable = CSSPropertyInfo | PropertyInfo | SlotValue;

export interface Knob {
  type: string;
  attribute: string | undefined;
  value: string | number | boolean | null;
  custom?: boolean;
}

type InputRenderer = (item: Knobable, id: string) => TemplateResult;

const capitalize = (name: string): string =>
  name[0].toUpperCase() + name.slice(1);

export const getSlotDefault = (name: string, initial: string): string =>
  capitalize(name === '' ? initial : name);

export const getSlotContent = (name: string) => getSlotDefault(name, 'content');

const getInputType = (type: string): 'checkbox' | 'number' | 'text' => {
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
  knob: Knobable,
  id: string
): TemplateResult => {
  const { name, value } = knob as CSSPropertyInfo;

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
  knob: Knobable,
  id: string
): TemplateResult => {
  const { name, type, value, options } = knob as PropertyInfo;
  let input;
  if (type === 'select' && Array.isArray(options)) {
    input = html`
      <select id=${id} data-name=${name} data-type=${type} part="select">
        ${options.map(
          (option) => html`<option value=${option}>${option}</option>`
        )}
      </select>
    `;
  } else if (normalizeType(type) === 'boolean') {
    input = html`
      <input
        id=${id}
        type="checkbox"
        .checked=${Boolean(value)}
        data-name=${name}
        data-type=${type}
        part="checkbox"
      />
    `;
  } else {
    input = html`
      <input
        id=${id}
        type=${getInputType(type)}
        .value=${value == null ? '' : String(value)}
        data-name=${name}
        data-type=${type}
        part="input"
      />
    `;
  }
  return input;
};

export const slotRenderer: InputRenderer = (
  knob: Knobable,
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
  items: Knobable[],
  header: string,
  type: string,
  renderer: InputRenderer
): TemplateResult => {
  const rows = items.map((item: Knobable) => {
    const { name } = item;
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
