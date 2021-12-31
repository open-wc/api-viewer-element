import { html, TemplateResult } from 'lit';
import {
  ClassField,
  CssCustomPropertyValue,
  getSlotContent,
  SlotValue
} from '@api-viewer/common';
import { Knob, Knobable } from './knobs.js';

type InputRenderer = (item: Knobable, id: string) => TemplateResult;

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
  const { name, knobType, value, options } = knob as Knob<ClassField>;
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
    // NOTE: type cast is fine, as we default it on next line
    const { name } = item as Knob<ClassField>;
    const id = `${type}-${name || 'default'}`;
    const label = type === 'slot' ? getSlotContent(name) : name;
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
