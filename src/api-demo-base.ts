import { LitElement, html, TemplateResult } from 'lit';
import { property } from 'lit/decorators/property.js';
import { until } from 'lit/directives/until.js';
import { EMPTY_ELEMENT } from './lib/constants.js';
import { ElementPromise } from './lib/types.js';
import { ApiViewerMixin, emptyDataWarning } from './api-viewer-mixin.js';
import './api-viewer-demo.js';

async function renderDemo(
  jsonFetched: ElementPromise,
  onSelect: (e: CustomEvent) => void,
  selected?: string,
  id?: number,
  exclude = ''
): Promise<TemplateResult> {
  const elements = await jsonFetched;

  if (!elements.length) {
    return emptyDataWarning;
  }

  const index = selected ? elements.findIndex((el) => el.name === selected) : 0;

  const { name, properties, slots, events, cssProperties } = {
    ...EMPTY_ELEMENT,
    ...(elements[index] || {})
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
    <api-viewer-demo
      .name="${name}"
      .props="${properties}"
      .slots="${slots}"
      .events="${events}"
      .cssProps="${cssProps}"
      .exclude="${exclude}"
      .vid="${id}"
    ></api-viewer-demo>
  `;
}

let id = 0;

export class ApiDemoBase extends ApiViewerMixin(LitElement) {
  @property({ type: String, attribute: 'exclude-knobs' }) excludeKnobs?: string;

  @property({ type: Number }) idx = 0;

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

  private _onSelect(e: CustomEvent): void {
    this.selected = String((e.target as HTMLSelectElement).value);
  }
}
