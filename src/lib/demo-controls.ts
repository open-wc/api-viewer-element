import { html, TemplateResult } from 'lit';
import { Knob, Knobable } from './knobs.js';
import { CSSPropertyInfo, PropertyInfo, SlotValue } from './types.js';
import { getSlotContent, normalizeType } from './utils.js';

type InputRenderer = (item: Knobable, id: string) => TemplateResult;

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
  const { name, knobType, value, options } = knob as Knob<PropertyInfo>;
  let input;
  if (knobType === 'select' && Array.isArray(options)) {
    input = html`
      <select id=${id} data-name=${name} data-type=${knobType} part="select">
        ${options.map(
          (option) => html`<option value=${option}>${option}</option>`
        )}
      </select>
    `;
  } else if (normalizeType(knobType) === 'boolean') {
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
    const { name } = item as Knob<PropertyInfo>;
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
