import { LitElement, html, property, TemplateResult } from 'lit-element';
import { until } from 'lit-html/directives/until.js';
import { ElementInfo, ElementSetInfo } from './lib/types.js';
import { queryTemplates } from './lib/utils.js';
import './api-viewer-content.js';

type ElementPromise = Promise<ElementInfo[]>;

async function fetchJson(src: string): ElementPromise {
  let result: ElementInfo[] = [];
  try {
    const file = await fetch(src);
    const json = (await file.json()) as ElementSetInfo;
    if (Array.isArray(json.tags) && json.tags.length) {
      result = json.tags;
    } else {
      console.error(`No element definitions found at ${src}`);
    }
  } catch (e) {
    console.error(e);
  }
  return result;
}

async function renderDocs(
  jsonFetched: ElementPromise,
  section: string,
  selected?: string,
  exclude = ''
): Promise<TemplateResult> {
  const elements = await jsonFetched;

  const index = elements.findIndex(el => el.name === selected);

  return elements.length
    ? html`
        <api-viewer-content
          .elements="${elements}"
          .section="${section}"
          .selected="${index >= 0 ? index : 0}"
          .exclude="${exclude}"
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

  @property({ type: String, attribute: 'exclude-knobs' }) excludeKnobs?: string;

  private jsonFetched: ElementPromise = Promise.resolve([]);

  private lastSrc?: string;

  protected render() {
    const { src } = this;

    if (src && this.lastSrc !== src) {
      this.lastSrc = src;
      this.jsonFetched = fetchJson(src);
    }

    return html`
      ${until(
        renderDocs(
          this.jsonFetched,
          this.section,
          this.selected,
          this.excludeKnobs
        )
      )}
    `;
  }

  protected firstUpdated() {
    queryTemplates(this);
  }
}
