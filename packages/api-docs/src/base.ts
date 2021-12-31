import { LitElement, html, TemplateResult } from 'lit';
import { until } from 'lit/directives/until.js';
import {
  CustomElement,
  emptyDataWarning,
  getCustomElements,
  getElementData,
  getPublicFields,
  hasCustomElements,
  ManifestMixin,
  Package
} from '@api-viewer/common/lib/index.js';
import { parse } from './utils/markdown.js';
import './layout.js';

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

  const data = getElementData(manifest, selected) as CustomElement;
  const props = getPublicFields(data.members);

  return html`
    <header part="header">
      <div part="header-title">&lt;${data.name}&gt;</div>
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
    <div ?hidden=${data.description === ''} part="docs-description">
      ${parse(data.description)}
    </div>
    <api-docs-layout
      .name=${data.name}
      .props=${props}
      .attrs=${data.attributes ?? []}
      .events=${data.events ?? []}
      .slots=${data.slots ?? []}
      .cssParts=${data.cssParts ?? []}
      .cssProps=${data.cssProperties ?? []}
      part="docs-container"
    ></api-docs-layout>
  `;
}

export class ApiDocsBase extends ManifestMixin(LitElement) {
  protected render(): TemplateResult {
    return html`${until(
      renderDocs(this.jsonFetched, this._onSelect, this.selected)
    )}`;
  }

  private _onSelect(e: Event): void {
    this.selected = (e.target as HTMLSelectElement).value;
  }
}
