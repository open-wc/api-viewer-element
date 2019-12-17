import { LitElement, html, property, TemplateResult } from 'lit-element';
import { until } from 'lit-html/directives/until.js';
import { fetchJson } from './lib/fetch-json.js';
import { ElementInfo } from './lib/types.js';
import { queryTemplates } from './lib/utils.js';
import './api-viewer-content.js';

async function renderDocs(
  jsonFetched: Promise<ElementInfo[]>,
  section: string,
  selected?: string
): Promise<TemplateResult> {
  const elements = await jsonFetched;

  const index = elements.findIndex(el => el.name === selected);

  return elements.length
    ? html`
        <api-viewer-content
          .elements="${elements}"
          .section="${section}"
          .selected="${index >= 0 ? index : 0}"
        ></api-viewer-content>
      `
    : html`
        <div part="warning">
          No custom elements found in the JSON file.
        </div>
      `;
}

export class ApiViewerBase extends LitElement {
  @property({ type: String }) src?: string;

  @property({ type: String }) section = 'docs';

  @property({ type: String }) selected?: string;

  private jsonFetched: Promise<ElementInfo[]> = Promise.resolve([]);

  private lastSrc?: string;

  protected render() {
    const { src } = this;

    if (src && this.lastSrc !== src) {
      this.lastSrc = src;
      this.jsonFetched = fetchJson(src);
    }

    return html`
      ${until(renderDocs(this.jsonFetched, this.section, this.selected))}
    `;
  }

  protected firstUpdated() {
    queryTemplates(this);
  }
}
