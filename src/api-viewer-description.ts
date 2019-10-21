import { LitElement, html, customElement, css, property } from 'lit-element';
import { parse } from './lib/markdown.js';

@customElement('api-viewer-description')
export class ApiViewerDescription extends LitElement {
  @property({ type: String }) description?: string | undefined;

  static get styles() {
    return css`
      :host {
        display: block;
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
