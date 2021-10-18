import type * as Manifest from 'custom-elements-manifest/schema';
import type { TemplateResult } from 'lit';

import { LitElement, html } from 'lit';
import { until } from 'lit/directives/until.js';

import { ApiViewerMixin, emptyDataWarning } from './api-viewer-mixin.js';
import './api-docs-content.js';
import { getElements } from './lib/utils.js';

async function renderDocs(
  jsonFetched: Promise<Manifest.Package | null>,
  selected?: string
): Promise<TemplateResult> {
  const elements = await getElements(jsonFetched);

  const index = elements.findIndex((el) => el.name === selected);

  return elements.length
    ? html`
        <api-docs-content
          .elements=${elements}
          .selected=${index >= 0 ? index : 0}
        ></api-docs-content>
      `
    : emptyDataWarning;
}

export class ApiDocsBase extends ApiViewerMixin(LitElement) {
  protected render(): TemplateResult {
    return html`${until(
      renderDocs(Promise.resolve(this.jsonFetched ?? null), this.selected)
    )}`;
  }
}
