import { LitElement, html, TemplateResult } from 'lit';
import { property } from 'lit/decorators/property.js';
import { until } from 'lit/directives/until.js';
import { ElementPromise } from './lib/types.js';
import { getElementData } from './lib/utils.js';
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

  const data = getElementData(elements, selected);

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
      .name=${data.name}
      .props=${data.properties}
      .slots=${data.slots}
      .events=${data.events}
      .cssProps=${data.cssProperties}
      .exclude=${exclude}
      .vid=${id}
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

  private _onSelect(e: Event): void {
    this.selected = (e.target as HTMLSelectElement).value;
  }
}
