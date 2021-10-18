import type * as Manifest from 'custom-elements-manifest/schema';
import type { TemplateResult } from 'lit';

import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { cache } from 'lit/directives/cache.js';
import { EMPTY_ELEMENT } from './lib/constants.js';
import { parse } from './lib/markdown.js';
import './api-viewer-docs.js';
import './api-viewer-demo.js';

@customElement('api-viewer-content')
export class ApiViewerContent extends LitElement {
  @property({ attribute: false }) elements: Manifest.CustomElement[] = [];

  @property({ type: Number }) selected = 0;

  @property() section = 'docs';

  @property() exclude = '';

  @property({ type: Number }) vid?: number;

  protected createRenderRoot(): this {
    return this;
  }

  protected render(): TemplateResult {
    const { elements, selected, section, exclude, vid } = this;

    const {
      name,
      description,
      members,
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
            ?checked=${section === 'docs'}
            @change=${this._onToggle}
            part="radio-button"
          />
          <label part="radio-label" for="docs">Docs</label>
          <input
            id="demo"
            type="radio"
            name="section-${this.vid}"
            value="demo"
            ?checked=${section === 'demo'}
            @change=${this._onToggle}
            part="radio-button"
          />
          <label part="radio-label" for="demo">Demo</label>
          <label part="select-label">
            <select
              @change=${this._onSelect}
              .value=${String(selected)}
              ?hidden=${elements.length === 1}
              part="select"
            >
              ${elements.map(
                (tag, idx) => html`<option value=${idx}>${tag.name}</option>`
              )}
            </select>
          </label>
        </nav>
      </header>
      ${cache(
        section === 'docs'
          ? html`
              <div ?hidden=${description === ''} part="docs-description">
                ${parse(description)}
              </div>
              <api-viewer-docs
                .name=${name}
                .members=${members}
                .attrs=${attributes}
                .events=${events}
                .slots=${slots}
                .cssParts=${cssParts}
                .cssProps=${cssProps}
              ></api-viewer-docs>
            `
          : html`
              <api-viewer-demo
                .name=${name}
                .members=${members}
                .slots=${slots}
                .events=${events}
                .cssProps=${cssProps}
                .exclude=${exclude}
                .vid=${vid}
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
