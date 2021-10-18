import type * as Manifest from 'custom-elements-manifest/schema';
import type { TemplateResult } from 'lit';

import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { EMPTY_ELEMENT } from './lib/constants.js';
import './api-viewer-demo.js';

@customElement('api-demo-content')
export class ApiDemoContent extends LitElement {
  @property({ attribute: false }) elements: Manifest.CustomElement[] = [];

  @property({ type: Number }) selected = 0;

  @property() exclude = '';

  @property({ type: Number }) vid?: number;

  protected createRenderRoot(): this {
    return this;
  }

  protected render(): TemplateResult {
    const { elements, selected, exclude, vid } = this;

    const {
      name,
      members = [],
      slots,
      events,
      cssProperties
    } = {
      ...EMPTY_ELEMENT,
      ...(elements[selected] || {})
    };

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
      <api-viewer-demo
        .name=${name}
        .members=${members}
        .slots=${slots}
        .events=${events}
        .cssProps=${cssProps}
        .exclude=${exclude}
        .vid=${vid}
      ></api-viewer-demo>
    `;
  }

  private _onSelect(e: CustomEvent) {
    this.selected = Number((e.target as HTMLSelectElement).value);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'api-demo-content': ApiDemoContent;
  }
}
