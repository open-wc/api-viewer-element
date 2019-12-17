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
      <div part="docs-row">
        <div part="docs-column">
          <div part="docs-label">Name</div>
          <div part="docs-value" class="accent">${name}</div>
        </div>
        ${attribute === undefined
          ? nothing
          : html`
              <div part="docs-column">
                <div part="docs-label">Attribute</div>
                <div part="docs-value">${attribute}</div>
              </div>
            `}
        ${valueType === undefined
          ? nothing
          : html`
              <div part="docs-column" class="column-type">
                <div part="docs-label">Type</div>
                <div part="docs-value">
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
        <div part="docs-label">Description</div>
        <api-viewer-marked
          part="docs-markdown"
          content="${description}"
        ></api-viewer-marked>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'api-viewer-item': ApiViewerItem;
  }
}
