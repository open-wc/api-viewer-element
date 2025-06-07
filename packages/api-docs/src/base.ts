import { html, LitElement, type TemplateResult } from 'lit';
import { until } from 'lit/directives/until.js';
import {
  emptyDataWarning,
  getCustomElements,
  getElementData,
  getPublicFields,
  getPublicMethods,
  hasCustomElements,
  ManifestMixin,
  type Package
} from '@api-viewer/common/lib/index.js';
import { classMap } from 'lit/directives/class-map.js';
import { parse } from './utils/markdown.js';
import './layout.js';

async function renderDocs(
  jsonFetched: Promise<Package | null>,
  onSelect: (e: CustomEvent) => void,
  only?: string[],
  selected?: string
): Promise<TemplateResult> {
  const manifest = await jsonFetched;

  if (!hasCustomElements(manifest)) {
    return emptyDataWarning;
  }

  const elements = getCustomElements(manifest, only);

  const data = getElementData(manifest, elements, selected)!;
  const props = getPublicFields(data.members);
  const methods = getPublicMethods(data.members);

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
    <div class=${classMap({ deprecated: !!data.deprecated })}>
      <div
        ?hidden=${data.deprecated === undefined || data.deprecated === false}
        part="docs-deprecated-component"
      >
        ${data.deprecated === true ? 'Deprecated' : data.deprecated}
      </div>
      <div ?hidden=${data.description === ''} part="docs-description">
        ${parse(data.description)}
      </div>
    </div>
    <api-docs-layout
      .name=${data.name}
      .props=${props}
      .attrs=${data.attributes ?? []}
      .methods=${methods}
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
      renderDocs(this.jsonFetched, this._onSelect, this.only, this.selected)
    )}`;
  }

  private _onSelect(e: Event): void {
    this.selected = (e.target as HTMLSelectElement).value;
  }
}
