import { html, TemplateResult } from 'lit-html';
import { CSSPropertyInfo, PropertyInfo, SlotValue } from './types.js';
import { getSlotTitle, normalizeType } from './utils.js';

type Knob = CSSPropertyInfo | PropertyInfo | SlotValue;

type InputRenderer = (item: Knob, id: string) => TemplateResult;

const getInputType = (type: string) => {
  switch (normalizeType(type)) {
    case 'boolean':
      return 'checkbox';
    case 'number':
      return 'number';
    default:
      return 'text';
  }
};

export const cssPropRenderer: InputRenderer = (knob: Knob, id: string) => {
  const { name, value } = knob as CSSPropertyInfo;

  return html`
    <input
      id="${id}"
      type="text"
      .value="${String(value)}"
      data-name="${name}"
      part="input"
    />
  `;
};

export const propRenderer: InputRenderer = (knob: Knob, id: string) => {
  const { name, type, value } = knob as PropertyInfo;
  const inputType = getInputType(type);
  let input;
  if (value === undefined) {
    input = html`
      <input
        id="${id}"
        type="${inputType}"
        data-name="${name}"
        data-type="${type}"
        part="input"
      />
    `;
  } else if (normalizeType(type) === 'boolean') {
    input = html`
      <input
        id="${id}"
        type="checkbox"
        .checked="${Boolean(value)}"
        data-name="${name}"
        data-type="${type}"
        part="checkbox"
      />
    `;
  } else {
    input = html`
      <input
        id="${id}"
        type="${inputType}"
        .value="${String(value)}"
        data-name="${name}"
        data-type="${type}"
        part="input"
      />
    `;
  }
  return input;
};

export const slotRenderer: InputRenderer = (knob: Knob, id: string) => {
  const { name, content } = knob as SlotValue;

  return html`
    <input
      id="${id}"
      type="text"
      .value="${content}"
      data-type="slot"
      data-slot="${name}"
      part="input"
    />
  `;
};

export const renderKnobs = (
  items: Knob[],
  type: string,
  renderer: InputRenderer
): TemplateResult => {
  const rows = items.map((item: Knob) => {
    const { name } = item;
    const id = `${type}-${name || 'default'}`;
    const label = type === 'slot' ? getSlotTitle(name) : name;
    return html`
      <tr>
        <td>
          <label for="${id}" part="knob-label">${label}</label>
        </td>
        <td>${renderer(item, id)}</td>
      </tr>
    `;
  });

  return html`
    <table>
      ${rows}
    </table>
  `;
};
