import { LitElement, html, customElement, property } from 'lit-element';
import { nothing } from 'lit-html';
import './api-viewer-marked.js';

@customElement('api-viewer-item')
export class ApiViewerItem extends LitElement {
  @property({ type: String }) name = '';

  @property({ type: String }) description = '';

  @property({ type: String, attribute: 'value-type' }) valueType?: string;

  @property({ type: String }) attribute?: string;

  @property({ type: String }) value?: string | number | boolean | null;

  protected createRenderRoot() {
    return this;
  }

  protected render() {
    const { name, description, valueType, attribute, value } = this;

    return html`
      <div class="api-row">
        <div class="api-col">
          <div class="api-label">Name</div>
          <div class="api-value accent">${name}</div>
        </div>
        ${attribute === undefined
          ? nothing
          : html`
              <div class="api-col">
                <div class="api-label">Attribute</div>
                <div class="api-value">${attribute}</div>
              </div>
            `}
        ${valueType === undefined
          ? nothing
          : html`
              <div class="api-col api-col-type">
                <div class="api-label">Type</div>
                <div class="api-value">
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
        <div class="api-label">Description</div>
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
