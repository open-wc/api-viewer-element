import { LitElement, html, TemplateResult } from 'lit';
import { until } from 'lit/directives/until.js';
import { ElementPromise } from './lib/types.js';
import { ApiViewerMixin, emptyDataWarning } from './api-viewer-mixin.js';
import './api-docs-content.js';

async function renderDocs(
  jsonFetched: ElementPromise,
  selected?: string
): Promise<TemplateResult> {
  const elements = await jsonFetched;

  const index = elements.findIndex((el) => el.name === selected);

  return elements.length
    ? html`
        <api-docs-content
          .elements="${elements}"
          .selected="${index >= 0 ? index : 0}"
        ></api-docs-content>
      `
    : emptyDataWarning;
}

export class ApiDocsBase extends ApiViewerMixin(LitElement) {
  protected render(): TemplateResult {
    return html`${until(renderDocs(this.jsonFetched, this.selected))}`;
  }
}
