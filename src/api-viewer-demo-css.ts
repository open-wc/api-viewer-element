import { LitElement, html, customElement, property } from 'lit-element';
import { InputRenderer, Knob, renderKnobs } from './lib/knobs.js';
import { CSSPropertyInfo } from './lib/types.js';

const cssPropRenderer: InputRenderer = (knob: Knob, id: string) => {
  const { name, value } = knob as CSSPropertyInfo;

  return html`
    <input
      id="${id}"
      type="text"
      .value="${String(value)}"
      data-name="${name}"
      part="input"
    />
  `;
};

@customElement('api-viewer-demo-css')
export class ApiViewerDemoCss extends LitElement {
  @property({ attribute: false, hasChanged: () => true })
  cssProps: CSSPropertyInfo[] = [];

  protected createRenderRoot() {
    return this;
  }

  protected render() {
    return html`
      <section part="knobs-column" @change="${this._onChange}">
        <h3 part="knobs-header">Custom CSS Properties</h3>
        ${renderKnobs(this.cssProps, 'css-prop', cssPropRenderer)}
      </section>
    `;
  }

  protected _onChange(e: Event) {
    const target = e.composedPath()[0];
    if (target && target instanceof HTMLInputElement) {
      this.dispatchEvent(
        new CustomEvent('css-changed', {
          detail: {
            name: target.dataset.name,
            value: target.value
          }
        })
      );
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'api-viewer-demo-css': ApiViewerDemoCss;
  }
}
