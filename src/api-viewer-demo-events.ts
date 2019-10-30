import {
  LitElement,
  html,
  customElement,
  css,
  property,
  TemplateResult
} from 'lit-element';
import { cache } from 'lit-html/directives/cache.js';
import buttonStyle from './lib/button-style.js';

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
    return [
      buttonStyle,
      css`
        :host {
          display: block;
          position: relative;
          padding: 0 1rem;
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
          margin-top: 1rem;
        }

        p:last-of-type {
          margin-bottom: 1rem;
        }
      `
    ];
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
