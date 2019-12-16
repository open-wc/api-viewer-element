import {
  LitElement,
  html,
  customElement,
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
        <p class="event">
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

  protected createRenderRoot() {
    return this;
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
              <p class="event">Interact with component to see the event log.</p>
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
