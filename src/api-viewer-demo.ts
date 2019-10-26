import {
  LitElement,
  html,
  customElement,
  css,
  property,
  TemplateResult
} from 'lit-element';
import { until } from 'lit-html/directives/until.js';
import { PropertyInfo, SlotInfo, EventInfo } from './lib/types.js';
import {
  EMPTY_PROP_INFO,
  EMPTY_SLOT_INFO,
  EMPTY_EVT_INFO
} from './lib/constants.js';

import './api-viewer-demo-layout.js';

@customElement('api-viewer-demo')
export class ApiViewerDemo extends LitElement {
  @property({ type: String }) name = '';

  @property({ attribute: false, hasChanged: () => true })
  props: PropertyInfo[] = EMPTY_PROP_INFO;

  @property({ attribute: false, hasChanged: () => true })
  slots: SlotInfo[] = EMPTY_SLOT_INFO;

  @property({ attribute: false, hasChanged: () => true })
  events: EventInfo[] = EMPTY_EVT_INFO;

  private whenDefined: Promise<unknown> = Promise.resolve();

  private lastName?: string;

  private async renderDemoLayout(
    whenDefined: Promise<unknown>
  ): Promise<TemplateResult> {
    await whenDefined;

    return html`
      <api-viewer-demo-layout
        .tag="${this.name}"
        .props="${this.props}"
        .slots="${this.slots}"
        .events="${this.events}"
      ></api-viewer-demo-layout>
    `;
  }

  private renderWarning(): TemplateResult {
    return html`
      <div class="warn">
        Element "${this.name}" is not defined. Have you imported it?
      </div>
    `;
  }

  static get styles() {
    return css`
      :host {
        display: block;
      }

      .warn {
        padding: 1rem;
      }
    `;
  }

  protected render() {
    const { name } = this;

    if (name && this.lastName !== name) {
      this.lastName = name;
      this.whenDefined = customElements.whenDefined(name);
    }

    return html`
      ${until(this.renderDemoLayout(this.whenDefined), this.renderWarning())}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'api-viewer-demo': ApiViewerDemo;
  }
}
