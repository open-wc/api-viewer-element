import { LitElement, html, customElement, css, property } from 'lit-element';

@customElement('api-viewer-header')
export class ApiViewerHeader extends LitElement {
  @property({ type: String }) heading = '';

  static get styles() {
    return css`
      :host {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0.75rem;
        background: var(--ave-primary-color);
        border-top-left-radius: 4px;
        border-top-right-radius: 4px;
      }

      .heading {
        color: var(--ave-header-color);
        font-family: var(--ave-monospace-font);
        font-size: 0.875rem;
        line-height: 1.5rem;
      }
    `;
  }

  render() {
    return html`
      <div class="heading">&lt;${this.heading}&gt;</div>
      <slot></slot>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'api-viewer-header': ApiViewerHeader;
  }
}
