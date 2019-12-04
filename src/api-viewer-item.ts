import { LitElement, html, customElement, css, property } from 'lit-element';
import { nothing } from 'lit-html';
import './api-viewer-marked.js';

@customElement('api-viewer-item')
export class ApiViewerItem extends LitElement {
  @property({ type: String }) name = '';

  @property({ type: String }) description = '';

  @property({ type: String, attribute: 'value-type' }) valueType?: string;

  @property({ type: String }) attribute?: string;

  @property({ type: String }) value?: string | number | boolean | null;

  static get styles() {
    return css`
      :host {
        display: block;
        padding: 0.5rem;
        color: var(--ave-item-color);
      }

      .row {
        display: flex;
        flex-wrap: wrap;
        margin-bottom: 1rem;
      }

      .col {
        box-sizing: border-box;
        flex-basis: 25%;
        padding-right: 0.5rem;
      }

      .col:only-child {
        flex-basis: 100%;
      }

      .col-type {
        flex-basis: 50%;
      }

      .label {
        color: var(--ave-label-color);
        font-size: 0.75rem;
        line-height: 1rem;
        letter-spacing: 0.1rem;
      }

      .value {
        font-family: var(--ave-monospace-font);
        font-size: 0.875rem;
        line-height: 1.5rem;
      }

      .accent {
        color: var(--ave-accent-color);
      }

      p {
        margin: 0.5rem 0;
        font-size: 0.9375rem;
        line-height: 1.5;
      }

      @media (max-width: 480px) {
        .col-type {
          flex-basis: 100%;
          margin-top: 1rem;
        }
      }
    `;
  }

  protected render() {
    const { name, description, valueType, attribute, value } = this;

    return html`
      <div class="row">
        <div class="col">
          <div class="label">Name</div>
          <div class="value accent">${name}</div>
        </div>
        ${attribute === undefined
          ? nothing
          : html`
              <div class="col">
                <div class="label">Attribute</div>
                <div class="value">${attribute}</div>
              </div>
            `}
        ${valueType === undefined
          ? nothing
          : html`
              <div class="col col-type">
                <div class="label">Type</div>
                <div class="value">
                  ${valueType.toLowerCase()}
                  ${value === undefined
                    ? nothing
                    : html`
                        = <span class="accent">${value}</span>
                      `}
                </div>
              </div>
            `}
      </div>
      <div ?hidden="${description === undefined}">
        <div class="label">Description</div>
        <api-viewer-marked content="${description}"></api-viewer-marked>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'api-viewer-item': ApiViewerItem;
  }
}
