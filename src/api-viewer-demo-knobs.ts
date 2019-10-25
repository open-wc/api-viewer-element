import {
  LitElement,
  html,
  customElement,
  css,
  property,
  TemplateResult
} from 'lit-element';
import { PropertyInfo } from './lib/types.js';
import { EMPTY_PROP_INFO } from './lib/constants.js';

const getInputType = (type: string) => {
  switch (type) {
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
  } else if (type === 'boolean') {
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

@customElement('api-viewer-demo-knobs')
export class ApiViewerDemoKnobs extends LitElement {
  @property({ attribute: false, hasChanged: () => true })
  props: PropertyInfo[] = EMPTY_PROP_INFO;

  static get styles() {
    return css`
      :host {
        display: block;
        padding: 1rem 1.5rem;
        background: #fafafa;
      }

      td {
        padding: 0.25rem 0.25rem 0.25rem 0;
        font-size: 0.9375rem;
      }
    `;
  }

  protected render() {
    return html`
      ${renderPropKnobs(this.props)}
    `;
  }

  protected firstUpdated() {
    this.renderRoot.addEventListener('change', (e: Event) => {
      const target = e.composedPath()[0];
      if (target && target instanceof HTMLInputElement) {
        const { type } = target.dataset;
        this.dispatchEvent(
          new CustomEvent('knob-changed', {
            detail: {
              name: target.dataset.name,
              type,
              value: type === 'boolean' ? target.checked : target.value
            }
          })
        );
      }
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'api-viewer-demo-knobs': ApiViewerDemoKnobs;
  }
}
