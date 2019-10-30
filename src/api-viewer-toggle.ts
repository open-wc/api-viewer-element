import { LitElement, html, customElement, css, property } from 'lit-element';

@customElement('api-viewer-toggle')
export class ApiViewerToggle extends LitElement {
  @property({ type: String }) section = 'docs';

  static get styles() {
    return css`
      :host {
        display: block;
        margin-right: 0.5rem;
        color: var(--ave-header-color);
        font-size: 0.875rem;
      }

      label {
        padding-right: 0.5rem;
      }
    `;
  }

  protected render() {
    const { section } = this;

    return html`
      <label>
        <input
          type="radio"
          name="section"
          value="docs"
          ?checked="${section === 'docs'}"
        />
        <span>Docs</span>
      </label>
      <label>
        <input
          type="radio"
          name="section"
          value="demo"
          ?checked="${section === 'demo'}"
        />
        <span>Demo</span>
      </label>
    `;
  }

  protected firstUpdated() {
    this.renderRoot.addEventListener('change', (e: Event) => {
      const section = (e.composedPath()[0] as HTMLInputElement).value;
      this.dispatchEvent(
        new CustomEvent('section-changed', {
          detail: {
            section
          }
        })
      );
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'api-viewer-toggle': ApiViewerToggle;
  }
}
