import { LitElement, html, customElement, css, property } from 'lit-element';
import { parse } from './lib/markdown.js';

@customElement('api-viewer-description')
export class ApiViewerDescription extends LitElement {
  @property({ type: String }) description?: string | undefined;

  static get styles() {
    return css`
      :host {
        display: block;
        padding: 0.75rem;
        border-bottom: solid 1px var(--ave-border-color);
      }

      p {
        margin: 0.5rem 0;
        font-size: 0.9375rem;
      }
    `;
  }

  render() {
    return html`
      ${parse(this.description)}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'api-viewer-description': ApiViewerDescription;
  }
}
