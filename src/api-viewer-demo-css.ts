import {
  LitElement,
  html,
  customElement,
  css,
  property,
  TemplateResult
} from 'lit-element';
import { CSSPropertyInfo } from './lib/types.js';

const renderCssProps = (props: CSSPropertyInfo[]): TemplateResult => {
  const rows = props.map(prop => {
    const { name, value } = prop;
    return html`
      <tr>
        <td>${name}</td>
        <td>
          <input type="text" .value="${String(value)}" data-name="${name}" />
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

@customElement('api-viewer-demo-css')
export class ApiViewerDemoCss extends LitElement {
  @property({ attribute: false, hasChanged: () => true })
  cssProps: CSSPropertyInfo[] = [];

  static get styles() {
    return css`
      :host {
        display: block;
        padding: 1rem;
      }

      section {
        width: 50%;
      }

      td {
        padding: 0.25rem 0.25rem 0.25rem 0;
        font-size: 0.9375rem;
        white-space: nowrap;
      }

      h3 {
        font-size: 1rem;
        font-weight: bold;
        margin: 0 0 0.25rem;
      }
    `;
  }

  protected render() {
    return html`
      <section>
        <h3>Custom CSS Properties</h3>
        ${renderCssProps(this.cssProps)}
      </section>
    `;
  }

  protected firstUpdated() {
    this.renderRoot.addEventListener('change', (e: Event) => {
      const target = e.composedPath()[0];
      if (target && target instanceof HTMLInputElement) {
        this.dispatchEvent(
          new CustomEvent('css-changed', {
            detail: {
              name: target.dataset.name,
              value: target.value
            }
          })
        );
      }
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'api-viewer-demo-css': ApiViewerDemoCss;
  }
}
