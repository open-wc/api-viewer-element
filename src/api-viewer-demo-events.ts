import { LitElement, html, nothing, TemplateResult } from 'lit';
import { property } from 'lit/decorators/property.js';
import { cache } from 'lit/directives/cache.js';

interface EventDetail {
  value: string | number | boolean | null | undefined;
}

const renderDetail = (detail: EventDetail): string => {
  const result = detail;
  const undef = 'undefined';
  if ('value' in detail && detail.value === undefined) {
    result.value = undef;
  }
  return ` detail: ${JSON.stringify(detail).replace(`"${undef}"`, undef)}`;
};

const renderEvents = (log: CustomEvent[]): TemplateResult =>
  html`
    ${log.map((event) => {
      return html`
        <p part="event-record">
          event:
          "${event.type}".${event.detail == null
            ? nothing
            : renderDetail(event.detail)}
        </p>
      `;
    })}
  `;

class ApiViewerDemoEvents extends LitElement {
  @property({ attribute: false })
  log: CustomEvent[] = [];

  protected createRenderRoot(): this {
    return this;
  }

  protected render(): TemplateResult {
    const { log } = this;
    return html`
      <button
        @click="${this._onClearClick}"
        ?hidden="${!log.length}"
        part="button"
      >
        Clear
      </button>
      ${cache(
        log.length
          ? renderEvents(log)
          : html`
              <p part="event-record">
                Interact with component to see the event log.
              </p>
            `
      )}
    `;
  }

  private _onClearClick(): void {
    this.dispatchEvent(new CustomEvent('clear'));
  }
}

customElements.define('api-viewer-demo-events', ApiViewerDemoEvents);

declare global {
  interface HTMLElementTagNameMap {
    'api-viewer-demo-events': ApiViewerDemoEvents;
  }
}
