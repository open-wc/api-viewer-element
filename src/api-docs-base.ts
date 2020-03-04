import { LitElement, html, TemplateResult } from 'lit-element';
import { until } from 'lit-html/directives/until.js';
import { ElementPromise } from './lib/types.js';
import { ApiViewerMixin } from './api-viewer-mixin.js';
import './api-docs-content.js';

async function renderDocs(
  jsonFetched: ElementPromise,
  selected?: string
): Promise<TemplateResult> {
  const elements = await jsonFetched;

  const index = elements.findIndex(el => el.name === selected);

  return elements.length
    ? html`
        <api-docs-content
          .elements="${elements}"
          .selected="${index >= 0 ? index : 0}"
        ></api-docs-content>
      `
    : html`
        <div part="warning">
          No custom elements found in the JSON file.
        </div>
      `;
}

export class ApiDocsBase extends ApiViewerMixin(LitElement) {
  protected render() {
    return html`
      ${until(renderDocs(this.jsonFetched, this.selected))}
    `;
  }
}
