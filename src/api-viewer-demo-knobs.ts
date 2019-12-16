import {
  LitElement,
  html,
  customElement,
  css,
  property,
  TemplateResult
} from 'lit-element';
import { PropertyInfo, SlotValue } from './lib/types.js';
import { getSlotTitle, hasSlotTemplate, normalizeType } from './lib/utils.js';

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

const getInput = (name: string, type: string, value: unknown) => {
  const inputType = getInputType(type);
  let input;
  if (value === undefined) {
    input = html`
      <input type="${inputType}" data-name="${name}" data-type="${type}" />
    `;
  } else if (normalizeType(type) === 'boolean') {
    input = html`
      <input
        type="checkbox"
        .checked="${Boolean(value)}"
        data-name="${name}"
        data-type="${type}"
      />
    `;
  } else {
    input = html`
      <input
        type="${inputType}"
        .value="${String(value)}"
        data-name="${name}"
        data-type="${type}"
      />
    `;
  }
  return input;
};

const renderPropKnobs = (props: PropertyInfo[]): TemplateResult => {
  const rows = props.map(prop => {
    const { name, type, value } = prop;
    return html`
      <tr>
        <td>${name}</td>
        <td>${getInput(name, type, value)}</td>
      </tr>
    `;
  });

  return html`
    <table>
      ${rows}
    </table>
  `;
};

const renderSlotKnobs = (slots: SlotValue[]): TemplateResult => {
  const rows = slots.map(slot => {
    const { name, content } = slot;
    return html`
      <tr>
        <td>${getSlotTitle(name)}</td>
        <td>
          <input
            type="text"
            .value="${content}"
            data-type="slot"
            data-slot="${name}"
          />
        </td>
      </tr>
    `;
  });

  return html`
    <table>
      ${rows}
    </table>
  `;
};

@customElement('api-viewer-demo-knobs')
export class ApiViewerDemoKnobs extends LitElement {
  @property({ type: String }) tag = '';

  @property({ attribute: false, hasChanged: () => true })
  props: PropertyInfo[] = [];

  @property({ attribute: false, hasChanged: () => true })
  slots: SlotValue[] = [];

  static get styles() {
    return css`
      :host {
        display: block;
        padding: 1rem;
      }

      .columns {
        display: flex;
      }

      section {
        width: 50%;
      }

      td {
        padding: 0.25rem 0.25rem 0.25rem 0;
        font-size: 0.9375rem;
      }

      h3 {
        font-size: 1rem;
        font-weight: bold;
        margin: 0 0 0.25rem;
      }

      @media (max-width: 480px) {
        .columns {
          flex-direction: column;
        }

        section:not(:last-child) {
          margin-bottom: 1rem;
        }
      }
    `;
  }

  protected render() {
    return html`
      <div class="columns">
        <section>
          <h3>Properties</h3>
          ${renderPropKnobs(this.props)}
        </section>
        <section
          ?hidden="${hasSlotTemplate(this.tag) || this.slots.length === 0}"
        >
          <h3>Slots</h3>
          ${renderSlotKnobs(this.slots)}
        </section>
      </div>
    `;
  }

  protected firstUpdated() {
    this.renderRoot.addEventListener('change', (e: Event) => {
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
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'api-viewer-demo-knobs': ApiViewerDemoKnobs;
  }
}
