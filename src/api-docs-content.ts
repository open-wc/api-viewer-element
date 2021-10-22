import {
  LitElement,
  html,
  customElement,
  property,
  TemplateResult
} from 'lit-element';
import { ElementInfo } from './lib/types.js';
import { EMPTY_ELEMENT } from './lib/constants.js';
import { parse } from './lib/markdown.js';
import './api-viewer-docs.js';

@customElement('api-docs-content')
export class ApiDocsContent extends LitElement {
  @property({ attribute: false }) elements: ElementInfo[] = [];

  @property({ type: Number }) selected = 0;

  protected createRenderRoot(): this {
    return this;
  }

  protected render(): TemplateResult {
    const { elements, selected } = this;

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
    `;
  }

  private _onSelect(e: CustomEvent): void {
    this.selected = Number((e.target as HTMLSelectElement).value);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'api-docs-content': ApiDocsContent;
  }
}
