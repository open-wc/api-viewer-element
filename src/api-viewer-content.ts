import { LitElement, html, customElement, property } from 'lit-element';
import { cache } from 'lit-html/directives/cache.js';
import { ElementInfo } from './lib/types.js';
import { EMPTY_ELEMENT } from './lib/constants.js';
import './api-viewer-docs.js';
import './api-viewer-demo.js';
import './api-viewer-header.js';
import './api-viewer-marked.js';
import './api-viewer-toggle.js';

@customElement('api-viewer-content')
export class ApiViewerContent extends LitElement {
  @property({ attribute: false }) elements: ElementInfo[] = [];

  @property({ type: Number }) selected = 0;

  @property({ type: String }) section = 'docs';

  protected createRenderRoot() {
    return this;
  }

  protected render() {
    const { elements, selected, section } = this;
    const tags = elements.map((tag: ElementInfo) => tag.name);

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

    const selectedTag = tags.find((_, index) => this.selected === index) || '';

    return html`
      <api-viewer-header .heading="${name}">
        <api-viewer-toggle
          .section="${section}"
          @section-changed="${this._onToggle}"
        ></api-viewer-toggle>
        <select
          @change="${this._onSelect}"
          .value="${selectedTag}"
          ?hidden="${tags.length === 1}"
        >
          ${tags.map(option => {
            return html`
              <option>${option}</option>
            `;
          })}
        </select>
      </api-viewer-header>
      ${cache(
        section === 'docs'
          ? html`
              <api-viewer-marked
                .content="${description}"
                ?hidden="${description === ''}"
                class="description"
              ></api-viewer-marked>
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
              ></api-viewer-demo>
            `
      )}
    `;
  }

  private _onSelect(e: CustomEvent) {
    const selected = (e.target as HTMLSelectElement).value;
    this.selected = this.elements.findIndex(el => el.name === selected);
  }

  private _onToggle(e: CustomEvent) {
    this.section = e.detail.section;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'api-viewer-content': ApiViewerContent;
  }
}
