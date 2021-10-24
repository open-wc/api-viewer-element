import { LitElement, html, css, TemplateResult } from 'lit';

let panelIdCounter = 0;

export class ApiViewerPanel extends LitElement {
  static get styles() {
    return css`
      :host {
        display: block;
        box-sizing: border-box;
        width: 100%;
        overflow: hidden;
      }

      :host([hidden]) {
        display: none !important;
      }
    `;
  }

  protected render(): TemplateResult {
    return html`<slot></slot>`;
  }

  protected firstUpdated(): void {
    this.setAttribute('role', 'tabpanel');

    if (!this.id) {
      this.id = `api-viewer-panel-${panelIdCounter++}`;
    }
  }
}

customElements.define('api-viewer-panel', ApiViewerPanel);

declare global {
  interface HTMLElementTagNameMap {
    'api-viewer-panel': ApiViewerPanel;
  }
}
