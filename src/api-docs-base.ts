import type { Package } from 'custom-elements-manifest/schema';

import { LitElement, html, TemplateResult } from 'lit';
import { until } from 'lit/directives/until.js';
import { parse } from './lib/markdown.js';
import {
  getCustomElements,
  getElementData,
  hasCustomElements
} from './lib/utils.js';
import { ApiViewerMixin, emptyDataWarning } from './api-viewer-mixin.js';
import './api-viewer-docs.js';

async function renderDocs(
  jsonFetched: Promise<Package | null>,
  onSelect: (e: CustomEvent) => void,
  selected?: string
): Promise<TemplateResult> {
  const manifest = await jsonFetched;

  if (!hasCustomElements(manifest)) {
    return emptyDataWarning;
  }

  const elements = getCustomElements(manifest);

  const data = getElementData(manifest, selected);

  return html`
    <header part="header">
      <div part="header-title">&lt;${data?.name}&gt;</div>
      <nav>
        <label part="select-label">
          <select
            @change=${onSelect}
            .value=${selected || ''}
            ?hidden=${elements.length === 1}
            part="select"
          >
            ${elements.map(
              (tag) => html`<option value=${tag.name}>${tag.name}</option>`
            )}
          </select>
        </label>
      </nav>
    </header>
    <div ?hidden=${data?.description === ''} part="docs-description">
      ${parse(data?.description)}
    </div>
    <api-viewer-docs
      .name=${data?.name}
      .attrs=${data?.attributes ?? []}
      .cssParts=${data?.cssParts ?? []}
      .cssProps=${data?.cssProperties ?? []}
      .events=${data?.events ?? []}
      .members=${data?.members ?? []}
      .slots=${data?.slots ?? []}
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
