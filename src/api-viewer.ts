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
import { queryTemplates } from './lib/utils.js';
import './api-viewer-content.js';

@customElement('api-viewer')
export class ApiViewer extends LitElement {
  @property({ type: String }) src?: string;

  @property({ type: String }) section = 'docs';

  private jsonFetched: Promise<ElementInfo[]> = Promise.resolve([]);

  private lastSrc?: string;

  // eslint-disable-next-line class-methods-use-this
  private async renderDocs(
    jsonFetched: Promise<ElementInfo[]>,
    section: string
  ): Promise<TemplateResult> {
    const elements = await jsonFetched;

    return elements.length
      ? html`
          <api-viewer-content
            .elements="${elements}"
            .section="${section}"
          ></api-viewer-content>
        `
      : html`
          <div class="warn">
            No custom elements found in the JSON file.
          </div>
        `;
  }

  static get styles() {
    return css`
      :host {
        display: block;
        box-sizing: border-box;
        max-width: 800px;
        min-width: 360px;
        font-size: 1rem;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
          'Oxygen-Sans', Ubuntu, Cantarell, sans-serif;
        border: 1px solid var(--ave-border-color);
        border-radius: var(--ave-border-radius);

        --ave-primary-color: #01579b;
        --ave-accent-color: #d63200;
        --ave-border-color: rgba(0, 0, 0, 0.12);
        --ave-border-radius: 4px;
        --ave-header-color: #fff;
        --ave-item-color: rgba(0, 0, 0, 0.87);
        --ave-label-color: #424242;
        --ave-tab-color: rgba(0, 0, 0, 0.54);
        --ave-monospace-font: Menlo, 'DejaVu Sans Mono', 'Liberation Mono',
          Consolas, 'Courier New', monospace;
      }

      .warn {
        padding: 1rem;
      }
    `;
  }

  protected render() {
    const { src } = this;

    if (src && this.lastSrc !== src) {
      this.lastSrc = src;
      this.jsonFetched = fetchJson(src);
    }

    return html`
      ${until(this.renderDocs(this.jsonFetched, this.section))}
    `;
  }

  protected firstUpdated() {
    queryTemplates(this);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'api-viewer': ApiViewer;
  }
}
