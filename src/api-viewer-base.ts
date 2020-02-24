import { LitElement, html, property, TemplateResult } from 'lit-element';
import { until } from 'lit-html/directives/until.js';
import { ElementInfo, ElementSetInfo } from './lib/types.js';
import { setTemplates } from './lib/utils.js';
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
  id?: number,
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
          .vid="${id}"
        ></api-viewer-content>
      `
    : html`
        <div part="warning">
          No custom elements found in the JSON file.
        </div>
      `;
}

let id = 0;

export class ApiViewerBase extends LitElement {
  @property({ type: String }) src?: string;

  @property({ type: String }) section = 'docs';

  @property({ type: String }) selected?: string;

  @property({ type: String, attribute: 'exclude-knobs' }) excludeKnobs?: string;

  @property({ attribute: false })
  elements?: ElementInfo[];

  private jsonFetched: ElementPromise = Promise.resolve([]);

  private lastSrc?: string;

  protected _id?: number;

  constructor() {
    super();

    this._id = ++id;
  }

  protected render() {
    const { src } = this;

    if (Array.isArray(this.elements)) {
      this.jsonFetched = Promise.resolve(this.elements);
    } else if (src && this.lastSrc !== src) {
      this.lastSrc = src;
      this.jsonFetched = fetchJson(src);
    }

    return html`
      ${until(
        renderDocs(
          this.jsonFetched,
          this.section,
          this.selected,
          this._id,
          this.excludeKnobs
        )
      )}
    `;
  }

  protected firstUpdated() {
    this.setTemplates();
  }

  protected setTemplates() {
    setTemplates(
      this._id as number,
      Array.from(this.querySelectorAll('template'))
    );
  }
}
