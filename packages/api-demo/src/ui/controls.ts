import { html, type TemplateResult } from 'lit';
import type {
  CssCustomPropertyValue,
  Knobable,
  PropertyKnob,
  SlotValue
} from '../types.js';

type InputRenderer = (item: Knobable, id: string) => TemplateResult;

const capitalize = (name: string): string =>
  name[0].toUpperCase() + name.slice(1);

export const formatSlot = (name: string): string =>
  capitalize(name === '' ? 'content' : name);

export const cssPropRenderer: InputRenderer = (
  knob: Knobable,
  id: string
): TemplateResult => {
  const { name, value } = knob as CssCustomPropertyValue;

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
  const { name, knobType, value, options } = knob as PropertyKnob;
  let input;
  if (knobType === 'select' && Array.isArray(options)) {
    input = html`
      <select id=${id} data-name=${name} data-type=${knobType} part="select">
        ${options.map(
          (option) => html`<option value=${option}>${option}</option>`
        )}
      </select>
    `;
  } else if (knobType === 'boolean') {
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
        type=${knobType === 'number' ? 'number' : 'text'}
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
    const { name } = item as PropertyKnob;
    const id = `${type}-${name || 'default'}`;
    const label = type === 'slot' ? formatSlot(name) : name;
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
