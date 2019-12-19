import { LitElement, html, customElement, property } from 'lit-element';
import { InputRenderer, Knob, renderKnobs } from './lib/knobs.js';
import { PropertyInfo, SlotValue } from './lib/types.js';
import { hasSlotTemplate, normalizeType } from './lib/utils.js';

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

const propRenderer: InputRenderer = (knob: Knob, id: string) => {
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

const slotRenderer: InputRenderer = (knob: Knob, id: string) => {
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

@customElement('api-viewer-demo-knobs')
export class ApiViewerDemoKnobs extends LitElement {
  @property({ type: String }) tag = '';

  @property({ attribute: false, hasChanged: () => true })
  props: PropertyInfo[] = [];

  @property({ attribute: false, hasChanged: () => true })
  slots: SlotValue[] = [];

  protected createRenderRoot() {
    return this;
  }

  protected render() {
    return html`
      <div class="columns" @change="${this._onChange}">
        <section part="knobs-column">
          <h3 part="knobs-header">Properties</h3>
          ${renderKnobs(this.props, 'prop', propRenderer)}
        </section>
        <section
          ?hidden="${hasSlotTemplate(this.tag) || this.slots.length === 0}"
          part="knobs-column"
        >
          <h3 part="knobs-header">Slots</h3>
          ${renderKnobs(this.slots, 'slot', slotRenderer)}
        </section>
      </div>
    `;
  }

  protected _onChange(e: Event) {
    const target = e.composedPath()[0];
    if (target && target instanceof HTMLInputElement) {
      const { type } = target.dataset;
      if (type === 'slot') {
        this.dispatchEvent(
          new CustomEvent('slot-changed', {
            detail: {
              name: target.dataset.slot,
              content: target.value
            }
          })
        );
      } else {
        this.dispatchEvent(
          new CustomEvent('prop-changed', {
            detail: {
              name: target.dataset.name,
              type,
              value:
                normalizeType(type as string) === 'boolean'
                  ? target.checked
                  : target.value
            }
          })
        );
      }
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'api-viewer-demo-knobs': ApiViewerDemoKnobs;
  }
}
