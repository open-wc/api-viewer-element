import { LitElement, html, customElement, css, property } from 'lit-element';
import { nothing, TemplateResult } from 'lit-html';
import { parse } from './lib/markdown.js';

const NOTHING = html`
  ${nothing}
`;

@customElement('api-viewer-item')
export class ApiViewerItem extends LitElement {
  @property({ type: String }) name = '';

  @property({ type: String }) description = '';

  @property({ type: String, attribute: 'value-type' }) valueType?:
    | string
    | undefined;

  @property({ type: String }) attribute?: string | undefined;

  static get styles() {
    return css`
      :host {
        display: block;
      }
    `;
  }

  // eslint-disable-next-line class-methods-use-this
  protected renderType(type?: string): TemplateResult {
    return type
      ? html`
          <span class="type">Type:</span>
          <span class="type-value">${type}</span>
        `
      : NOTHING;
  }

  // eslint-disable-next-line class-methods-use-this
  protected renderAttr(attr?: string): TemplateResult {
    return attr
      ? html`
          <span class="attr">Attribute:</span>
          <span class="attr-value">${attr}</span>
        `
      : NOTHING;
  }

  render() {
    const { name, description, valueType, attribute } = this;

    return html`
      <div class="row">
        <span class="col">
          <span class="name">Name:</span>
          <span class="name-value">${name}</span>
        </span>
        <span class="col">
          ${this.renderType(valueType)}
        </span>
        <span class="col">
          ${this.renderAttr(attribute)}
        </span>
      </div>
      <div class="row">
        <span class="description">Description:</span>
        ${parse(description)}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'api-viewer-item': ApiViewerItem;
  }
}
