import { LitElement, html, customElement, css, property } from 'lit-element';

@customElement('api-viewer-description')
export class ApiViewerDescription extends LitElement {
  @property({ type: String }) description = '';

  static get styles() {
    return css`
      :host {
        display: block;
      }
    `;
  }

  render() {
    return html`
      ${this.description}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'api-viewer-description': ApiViewerDescription;
  }
}
