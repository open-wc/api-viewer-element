import { html, LitElement, type TemplateResult } from 'lit';
import { property } from 'lit/decorators/property.js';
import { until } from 'lit/directives/until.js';
import {
  emptyDataWarning,
  getCustomElements,
  getElementData,
  getPublicFields,
  hasCustomElements,
  ManifestMixin,
  type CustomElement,
  type Package
} from '@api-viewer/common/lib/index.js';
import './layout.js';

async function renderDemo(
  jsonFetched: Promise<Package | null>,
  onSelect: (e: CustomEvent) => void,
  only?: string[],
  selected?: string,
  id?: number,
  exclude = ''
): Promise<TemplateResult> {
  const manifest = await jsonFetched;

  if (!hasCustomElements(manifest)) {
    return emptyDataWarning;
  }

  const elements = getCustomElements(manifest, only);

  const data = getElementData(manifest, elements, selected) as CustomElement;
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
    <api-demo-layout
      .tag=${data.name}
      .props=${props}
      .events=${data.events ?? []}
      .slots=${data.slots ?? []}
      .cssProps=${data.cssProperties ?? []}
      .exclude=${exclude}
      .vid=${id}
      part="demo-container"
    ></api-demo-layout>
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
          this.only,
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
