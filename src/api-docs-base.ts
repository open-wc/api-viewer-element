import { LitElement, html, TemplateResult } from 'lit';
import { until } from 'lit/directives/until.js';
import { EMPTY_ELEMENT } from './lib/constants.js';
import { parse } from './lib/markdown.js';
import { ElementPromise } from './lib/types.js';
import { sortCss } from './lib/utils.js';
import { ApiViewerMixin, emptyDataWarning } from './api-viewer-mixin.js';
import './api-viewer-docs.js';

async function renderDocs(
  jsonFetched: ElementPromise,
  onSelect: (e: CustomEvent) => void,
  selected?: string
): Promise<TemplateResult> {
  const elements = await jsonFetched;

  if (!elements.length) {
    return emptyDataWarning;
  }

  const index = selected ? elements.findIndex((el) => el.name === selected) : 0;

  const {
    name,
    description,
    properties,
    attributes,
    slots,
    events,
    cssParts,
    cssProperties
  } = { ...EMPTY_ELEMENT, ...(elements[index] || {}) };

  // TODO: analyzer should sort CSS custom properties
  const cssProps = sortCss(cssProperties);

  return html`
    <header part="header">
      <div part="header-title">&lt;${name}&gt;</div>
      <nav>
        <label part="select-label">
          <select
            @change="${onSelect}"
            .value="${String(selected)}"
            ?hidden="${elements.length === 1}"
            part="select"
          >
            ${elements.map(
              (tag) => html`<option value="${tag.name}">${tag.name}</option>`
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

export class ApiDocsBase extends ApiViewerMixin(LitElement) {
  protected render(): TemplateResult {
    return html`${until(
      renderDocs(this.jsonFetched, this._onSelect, this.selected)
    )}`;
  }

  private _onSelect(e: Event): void {
    this.selected = (e.target as HTMLSelectElement).value;
  }
}
