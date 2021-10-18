import type * as Manifest from 'custom-elements-manifest/schema';

import { html, TemplateResult } from 'lit';
import { Prop } from './types.js';
import { normalizeType } from './utils.js';

const DEFAULT = 'default';

export type Knob = (Prop | Manifest.CssCustomProperty | Manifest.Slot) & {
  value: string;
  options: unknown;
};

type InputRenderer<T extends Knob | Prop = Knob> = (
  item: T,
  id: string
) => TemplateResult;

const capitalize = (name: string) => name[0].toUpperCase() + name.slice(1);

export const getSlotDefault = (name: string, initial: string) =>
  capitalize(name === '' ? initial : name);

export const getSlotContent = (name: string) => getSlotDefault(name, 'content');

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
  const { name, value } = knob;

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

export const propRenderer: InputRenderer = (knob: Knob, id: string) => {
  const { name, type, value, options } = knob as Knob & Prop;
  let input;
  if (type?.text === 'select' && Array.isArray(options)) {
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
        type=${getInputType(type?.text ?? '')}
        .value=${value == null ? '' : String(value)}
        data-name=${name}
        data-type=${type}
        part="input"
      />
    `;
  }
  return input;
};

export const slotRenderer: InputRenderer<
  Knob & Manifest.Slot & { content: string }
> = (knob, id: string) => {
  const { name, content } = knob;

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

export const renderKnobs = <T extends Prop | Knob>(
  items: T[],
  header: string,
  type: string,
  renderer: InputRenderer<T>
): TemplateResult => {
  const rows = items.map((item) => {
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
