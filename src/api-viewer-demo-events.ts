import {
  LitElement,
  html,
  customElement,
  css,
  property,
  TemplateResult
} from 'lit-element';
import { cache } from 'lit-html/directives/cache.js';

interface EventDetail {
  value: string | number | boolean | null | undefined;
}

const renderDetail = (detail: EventDetail): string => {
  const result = detail;
  if ('value' in detail && detail.value === undefined) {
    result.value = 'undefined';
  }
  return JSON.stringify(detail).replace('"undefined"', 'undefined');
};

const renderEvents = (log: CustomEvent[]): TemplateResult => {
  return html`
    ${log.map(e => {
      return html`
        <p>
          event: "${e.type}". detail: ${renderDetail(e.detail)}
        </p>
      `;
    })}
  `;
};

@customElement('api-viewer-demo-events')
export class ApiViewerDemoEvents extends LitElement {
  @property({ attribute: false, hasChanged: () => true })
  log: CustomEvent[] = [];

  static get styles() {
    return css`
      :host {
        display: block;
        position: relative;
        padding: 0 1.5rem;
        min-height: 50px;
        max-height: 200px;
        overflow: auto;
      }

      p {
        margin: 0 0 0.25rem;
        font-family: var(--ave-monospace-font);
        font-size: 0.875rem;
        line-height: 1.5;
      }

      p:first-of-type {
        margin-top: 1.5rem;
      }

      p:last-of-type {
        margin-bottom: 1.5rem;
      }

      button {
        position: absolute;
        top: 0.5rem;
        right: 0.5rem;
        text-transform: uppercase;
        border: none;
        border-radius: 0.25em;
        cursor: pointer;
        background: rgba(0, 0, 0, 0.3);
        color: #fff;
      }

      button:focus,
      button:hover {
        background: rgba(0, 0, 0, 0.6);
      }
    `;
  }

  protected render() {
    const { log } = this;
    return html`
      <button @click="${this._onClearClick}" ?hidden="${!log.length}">
        Clear
      </button>
      ${cache(
        log.length
          ? renderEvents(log)
          : html`
              <p>Interact with component to see the event log.</p>
            `
      )}
    `;
  }

  private _onClearClick() {
    this.dispatchEvent(new CustomEvent('clear'));
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'api-viewer-demo-events': ApiViewerDemoEvents;
  }
}
