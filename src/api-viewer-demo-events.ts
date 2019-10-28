import { LitElement, html, customElement, css, property } from 'lit-element';

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
        max-height: 200px;
        overflow: auto;
      }

      .event {
        margin: 0 0 0.25rem;
        font-family: var(--ave-monospace-font);
        font-size: 0.875rem;
        line-height: 1.5;
      }

      .event:first-of-type {
        margin-top: 1.5rem;
      }

      .event:last-of-type {
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
    return html`
      <button @click="${this._onClearClick}">Clear</button>
      ${this.log.map(e => {
        return html`
          <p class="event">
            event: "${e.type}". detail: ${renderDetail(e.detail)}
          </p>
        `;
      })}
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
