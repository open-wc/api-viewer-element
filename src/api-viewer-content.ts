import { LitElement, html, customElement, css, property } from 'lit-element';
import { cache } from 'lit-html/directives/cache.js';
import { ElementInfo } from './lib/types.js';
import { EMPTY_ELEMENT } from './lib/constants.js';
import './api-viewer-docs.js';
import './api-viewer-demo.js';
import './api-viewer-header.js';
import './api-viewer-marked.js';
import './api-viewer-select.js';
import './api-viewer-toggle.js';

@customElement('api-viewer-content')
export class ApiViewerContent extends LitElement {
  @property({ attribute: false }) elements: ElementInfo[] = [];

  @property({ type: Number }) selected = 0;

  @property({ type: String }) section = 'docs';

  static get styles() {
    return css`
      :host {
        display: block;
      }

      .description {
        padding: 0.75rem;
        border-bottom: solid 1px var(--ave-border-color);
      }
    `;
  }

  protected render() {
    const { elements, selected, section } = this;
    const tags = elements.map((tag: ElementInfo) => tag.name);

    const element = EMPTY_ELEMENT;
    if (elements[selected]) {
      Object.assign(element, elements[selected]);
    }

    const {
      name,
      description,
      properties,
      attributes,
      slots,
      events,
      cssProperties
    } = element;

    // TODO: analyzer should sort CSS custom properties
    const cssProps = (cssProperties || []).sort((a, b) =>
      a.name > b.name ? 1 : -1
    );

    return html`
      <api-viewer-header .heading="${name}">
        <api-viewer-toggle
          .section="${section}"
          @section-changed="${this._onToggle}"
        ></api-viewer-toggle>
        <api-viewer-select
          .options="${tags}"
          .selected="${selected}"
          @selected-changed="${this._onSelect}"
        ></api-viewer-select>
      </api-viewer-header>
      ${cache(
        section === 'docs'
          ? html`
              <api-viewer-marked
                .content="${description}"
                class="description"
              ></api-viewer-marked>
              <api-viewer-docs
                .name="${name}"
                .props="${properties}"
                .attrs="${attributes}"
                .events="${events}"
                .slots="${slots}"
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
    const { selected } = e.detail;
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
