import { LitElement, html, customElement, property } from 'lit-element';

@customElement('api-viewer-toggle')
export class ApiViewerToggle extends LitElement {
  @property({ type: String }) section = 'docs';

  protected createRenderRoot() {
    return this;
  }

  protected render() {
    const { section } = this;

    return html`
      <label class="radio-label">
        <input
          type="radio"
          name="section"
          value="docs"
          ?checked="${section === 'docs'}"
        />
        <span>Docs</span>
      </label>
      <label class="radio-label">
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
