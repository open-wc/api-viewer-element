import { LitElement, html, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { until } from 'lit/directives/until.js';
import { ElementPromise } from './lib/types.js';
import { ApiViewerMixin, emptyDataWarning } from './api-viewer-mixin.js';
import './api-demo-content.js';

async function renderDemo(
  jsonFetched: ElementPromise,
  selected?: string,
  id?: number,
  exclude = ''
): Promise<TemplateResult> {
  const elements = await jsonFetched;

  const index = elements.findIndex((el) => el.name === selected);

  return elements.length
    ? html`
        <api-demo-content
          .elements="${elements}"
          .selected="${index >= 0 ? index : 0}"
          .exclude="${exclude}"
          .vid="${id}"
        ></api-demo-content>
      `
    : emptyDataWarning;
}

let id = 0;

export class ApiDemoBase extends ApiViewerMixin(LitElement) {
  @property({ type: String, attribute: 'exclude-knobs' }) excludeKnobs?: string;

  protected _id?: number;

  constructor() {
    super();

    this._id = id++;
  }

  protected render(): TemplateResult {
    return html`
      ${until(
        renderDemo(this.jsonFetched, this.selected, this._id, this.excludeKnobs)
      )}
    `;
  }
}
