import { LitElement, html, TemplateResult } from 'lit';
import { property } from 'lit/decorators/property.js';
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
} from '@api-viewer/common';
import './api-viewer-demo.js';

async function renderDemo(
  jsonFetched: Promise<Package | null>,
  onSelect: (e: CustomEvent) => void,
  selected?: string,
  id?: number,
  exclude = ''
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
    <api-viewer-demo
      .tag=${data.name}
      .props=${props}
      .events=${data.events ?? []}
      .slots=${data.slots ?? []}
      .cssProps=${data.cssProperties ?? []}
      .exclude=${exclude}
      .vid=${id}
      part="demo-container"
    ></api-viewer-demo>
  `;
}

let id = 0;

export class ApiDemoBase extends ManifestMixin(LitElement) {
  @property({ type: String, attribute: 'exclude-knobs' }) excludeKnobs?: string;

  protected _id?: number;

  constructor() {
    super();

    this._id = id++;
  }

  protected render(): TemplateResult {
    return html`
      ${until(
        renderDemo(
          this.jsonFetched,
          this._onSelect,
          this.selected,
          this._id,
          this.excludeKnobs
        )
      )}
    `;
  }

  private _onSelect(e: Event): void {
    this.selected = (e.target as HTMLSelectElement).value;
  }
}
