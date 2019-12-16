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
        border-top-left-radius: var(--ave-border-radius);
        border-top-right-radius: var(--ave-border-radius);
      }

      .heading {
        color: var(--ave-header-color);
        font-family: var(--ave-monospace-font);
        font-size: 0.875rem;
        line-height: 1.5rem;
      }

      .controls {
        display: flex;
      }

      @media (max-width: 480px) {
        .controls {
          flex-direction: column;
        }

        .controls ::slotted(:not(:last-child)) {
          margin-bottom: 0.5rem;
        }
      }

      ::slotted(label) {
        display: block;
        margin-right: 0.5rem;
        color: var(--ave-header-color);
        font-size: 0.875rem;
      }
    `;
  }

  protected render() {
    return html`
      <div class="heading">&lt;${this.heading}&gt;</div>
      <div class="controls">
        <slot></slot>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'api-viewer-header': ApiViewerHeader;
  }
}
