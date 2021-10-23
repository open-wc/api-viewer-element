import { LitElement, html, TemplateResult } from 'lit';
import { property } from 'lit/decorators/property.js';
import { until } from 'lit/directives/until.js';
import { ElementPromise } from './lib/types.js';
import { setTemplates } from './lib/utils.js';
import { ApiViewerMixin, emptyDataWarning } from './api-viewer-mixin.js';
import './api-viewer-content.js';

async function renderDocs(
  jsonFetched: ElementPromise,
  section: string,
  selected?: string,
  id?: number,
  exclude = ''
): Promise<TemplateResult> {
  const elements = await jsonFetched;

  const index = elements.findIndex((el) => el.name === selected);

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
    : emptyDataWarning;
}

let id = 0;

export class ApiViewerBase extends ApiViewerMixin(LitElement) {
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
}
