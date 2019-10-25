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

const renderPropKnobs = (props: PropertyInfo[]): TemplateResult => {
  // TODO set default property values to knobs

  const rows = props.map(prop => {
    return html`
      <tr>
        <td>${prop.name}</td>
        <td>
          <input
            type="${prop.type === 'boolean' ? 'checkbox' : 'text'}"
            data-name="${prop.name}"
            data-type="${prop.type}"
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
  @property({ attribute: false, hasChanged: () => true })
  props: PropertyInfo[] = EMPTY_PROP_INFO;

  static get styles() {
    return css`
      :host {
        display: block;
        background: #fafafa;
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
