import { LitElement, html, TemplateResult } from 'lit';
import { property } from 'lit/decorators/property.js';
import { cache } from 'lit/directives/cache.js';
import { until } from 'lit/directives/until.js';
import {
  CustomElement,
  emptyDataWarning,
  getCustomElements,
  getElementData,
  getPublicFields,
  getPublicMethods,
  hasCustomElements,
  ManifestMixin,
  Package
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
            <div ?hidden=${data.description === ''} part="docs-description">
              ${parse(data.description)}
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
      this._id as number,
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
