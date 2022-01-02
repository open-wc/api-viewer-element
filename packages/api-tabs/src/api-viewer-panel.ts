import { html } from '@api-viewer/common/lib/utils.js';

let panelIdCounter = 0;

const tpl = html`
  <style>
    :host {
      display: block;
      box-sizing: border-box;
      width: 100%;
      overflow: hidden;
    }

    :host([hidden]) {
      display: none !important;
    }
  </style>
  <slot></slot>
`;

export class ApiViewerPanel extends HTMLElement {
  constructor() {
    super();

    const root = this.attachShadow({ mode: 'open' });
    root.appendChild(tpl.content.cloneNode(true));
  }

  connectedCallback(): void {
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
