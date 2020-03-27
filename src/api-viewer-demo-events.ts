import {
  LitElement,
  html,
  customElement,
  property,
  TemplateResult
} from 'lit-element';
import { nothing } from 'lit-html';
import { cache } from 'lit-html/directives/cache.js';

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

const renderEvents = (log: CustomEvent[]): TemplateResult => {
  return html`
    ${log.map((e) => {
      const { type, detail } = e;
      return html`
        <p part="event-record">
          event: "${type}".${detail == null ? nothing : renderDetail(detail)}
        </p>
      `;
    })}
  `;
};

@customElement('api-viewer-demo-events')
export class ApiViewerDemoEvents extends LitElement {
  @property({ attribute: false })
  log: CustomEvent[] = [];

  protected createRenderRoot() {
    return this;
  }

  protected render() {
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

  private _onClearClick() {
    this.dispatchEvent(new CustomEvent('clear'));
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'api-viewer-demo-events': ApiViewerDemoEvents;
  }
}
