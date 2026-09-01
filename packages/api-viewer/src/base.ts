import { LitElement, html, type TemplateResult } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { property } from 'lit/decorators/property.js';
import { cache } from 'lit/directives/cache.js';
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
import { setTemplates } from '@api-viewer/common/lib/templates.js';
import '@api-viewer/demo/lib/layout.js';
import '@api-viewer/docs/lib/layout.js';
import { parse } from '@api-viewer/docs/lib/utils/markdown.js';

async function renderDocs(
  jsonFetched: Promise<Package | null>,
  section: string,
  onSelect: (e: CustomEvent) => void,
  onToggle: (e: CustomEvent) => void,
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

  const data = getElementData(manifest, elements, selected)!;
  const props = getPublicFields(data.members);
  const methods = getPublicMethods(data.members);

  return html`
    <header part="header">
      <div part="header-title">&lt;${data.name}&gt;</div>
      <nav>
        <input
          id="docs"
          type="radio"
          name="section-${id}"
          value="docs"
          ?checked=${section === 'docs'}
          @change=${onToggle}
          part="radio-button"
        />
        <label part="radio-label" for="docs">Docs</label>
        <input
          id="demo"
          type="radio"
          name="section-${id}"
          value="demo"
          ?checked=${section === 'demo'}
          @change=${onToggle}
          part="radio-button"
        />
        <label part="radio-label" for="demo">Demo</label>
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
    ${cache(
      section === 'docs'
        ? html`
            <div class=${classMap({ deprecated: !!data.deprecated })}>
              <div
                ?hidden=${data.deprecated === undefined ||
                data.deprecated === false}
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
          `
        : html`
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
          `
    )}
  `;
}

let id = 0;

export class ApiViewerBase extends ManifestMixin(LitElement) {
  @property() section = 'docs';

  @property({ type: String, attribute: 'exclude-knobs' }) excludeKnobs?: string;

  protected _id?: number;

  constructor() {
    super();

    this._id = id++;
  }

  protected render(): TemplateResult {
    return html`
      ${until(
        renderDocs(
          this.jsonFetched,
          this.section,
          this._onSelect,
          this._onToggle,
          this.only,
          this.selected,
          this._id,
          this.excludeKnobs
        )
      )}
    `;
  }

  protected firstUpdated(): void {
    this.setTemplates();
  }

  public setTemplates(templates?: HTMLTemplateElement[]): void {
    setTemplates(
      this._id!,
      templates || Array.from(this.querySelectorAll('template'))
    );
  }

  private _onSelect(e: Event): void {
    this.selected = (e.target as HTMLSelectElement).value;
  }

  private _onToggle(e: CustomEvent): void {
    this.section = (e.target as HTMLInputElement).value;
  }
}
