import {
  LitElement,
  html,
  customElement,
  css,
  property,
  TemplateResult
} from 'lit-element';
import { until } from 'lit-html/directives/until.js';
import { fetchJson } from './lib/fetch-json.js';
import { ElementInfo } from './lib/types.js';
import { EMPTY_ELEMENTS } from './lib/constants.js';
import './api-viewer-docs.js';

@customElement('api-viewer')
export class ApiViewer extends LitElement {
  @property({ attribute: 'json-src', type: String }) jsonSrc?: string;

  private jsonFetched: Promise<ElementInfo[]> = Promise.resolve(EMPTY_ELEMENTS);

  private lastJsonSrc?: string;

  // eslint-disable-next-line class-methods-use-this
  private async renderDocs(
    jsonFetched: Promise<ElementInfo[]>
  ): Promise<TemplateResult> {
    const elements = await jsonFetched;

    return html`
      <api-viewer-docs .elements="${elements}"></api-viewer-docs>
    `;
  }

  static get styles() {
    return css`
      :host {
        display: block;
      }
    `;
  }

  render() {
    const { jsonSrc } = this;

    if (jsonSrc && this.lastJsonSrc !== jsonSrc) {
      this.lastJsonSrc = jsonSrc;
      this.jsonFetched = fetchJson(jsonSrc);
    }

    return html`
      ${until(this.renderDocs(this.jsonFetched))}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'api-viewer': ApiViewer;
  }
}
