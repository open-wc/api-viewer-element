import { html, TemplateResult } from 'lit-html';
import { CSSPropertyInfo, PropertyInfo, SlotValue } from './types.js';
import { getSlotTitle } from './utils.js';

export type Knob = CSSPropertyInfo | PropertyInfo | SlotValue;

export type InputRenderer = (item: Knob, id: string) => TemplateResult;

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
