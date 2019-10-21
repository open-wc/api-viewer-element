import { LitElement, html, customElement, css } from 'lit-element';

let panelIdCounter = 0;

@customElement('api-viewer-panel')
export class ApiViewerPanel extends LitElement {
  static get styles() {
    return css`
      :host {
        display: block;
        width: 100%;
        max-height: 800px;
        overflow: auto;
      }

      :host([hidden]) {
        display: none !important;
      }
    `;
  }

  render() {
    return html`
      <slot></slot>
    `;
  }

  firstUpdated() {
    this.setAttribute('role', 'tabpanel');

    if (!this.id) {
      this.id = `api-viewer-panel-${panelIdCounter++}`;
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'api-viewer-panel': ApiViewerPanel;
  }
}
