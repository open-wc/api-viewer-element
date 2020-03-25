import { LitElement, html, customElement, property } from 'lit-element';
import { cache } from 'lit-html/directives/cache.js';
import { ElementInfo } from './lib/types.js';
import { EMPTY_ELEMENT } from './lib/constants.js';
import { parse } from './lib/markdown.js';
import './api-viewer-docs.js';
import './api-viewer-demo.js';

@customElement('api-viewer-content')
export class ApiViewerContent extends LitElement {
  @property({ attribute: false }) elements: ElementInfo[] = [];

  @property({ type: Number }) selected = 0;

  @property() section = 'docs';

  @property() exclude = '';

  @property({ type: Number }) vid?: number;

  protected createRenderRoot() {
    return this;
  }

  protected render() {
    const { elements, selected, section, exclude, vid } = this;

    const {
      name,
      description,
      properties,
      attributes,
      slots,
      events,
      cssParts,
      cssProperties
    } = { ...EMPTY_ELEMENT, ...(elements[selected] || {}) };

    // TODO: analyzer should sort CSS custom properties
    const cssProps = (cssProperties || []).sort((a, b) =>
      a.name > b.name ? 1 : -1
    );

    return html`
      <header part="header">
        <div part="header-title">&lt;${name}&gt;</div>
        <nav>
          <input
            id="docs"
            type="radio"
            name="section-${this.vid}"
            value="docs"
            ?checked="${section === 'docs'}"
            @change="${this._onToggle}"
            part="radio-button"
          />
          <label part="radio-label" for="docs">Docs</label>
          <input
            id="demo"
            type="radio"
            name="section-${this.vid}"
            value="demo"
            ?checked="${section === 'demo'}"
            @change="${this._onToggle}"
            part="radio-button"
          />
          <label part="radio-label" for="demo">Demo</label>
          <label part="select-label">
            <select
              @change="${this._onSelect}"
              .value="${String(selected)}"
              ?hidden="${elements.length === 1}"
              part="select"
            >
              ${elements.map(
                (tag, idx) => html`<option value="${idx}">${tag.name}</option>`
              )}
            </select>
          </label>
        </nav>
      </header>
      ${cache(
        section === 'docs'
          ? html`
              <div ?hidden="${description === ''}" part="docs-description">
                ${parse(description)}
              </div>
              <api-viewer-docs
                .name="${name}"
                .props="${properties}"
                .attrs="${attributes}"
                .events="${events}"
                .slots="${slots}"
                .cssParts="${cssParts}"
                .cssProps="${cssProps}"
              ></api-viewer-docs>
            `
          : html`
              <api-viewer-demo
                .name="${name}"
                .props="${properties}"
                .slots="${slots}"
                .events="${events}"
                .cssProps="${cssProps}"
                .exclude="${exclude}"
                .vid="${vid}"
              ></api-viewer-demo>
            `
      )}
    `;
  }

  private _onSelect(e: CustomEvent) {
    this.selected = Number((e.target as HTMLSelectElement).value);
  }

  private _onToggle(e: CustomEvent) {
    this.section = (e.target as HTMLInputElement).value;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'api-viewer-content': ApiViewerContent;
  }
}
