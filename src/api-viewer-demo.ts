import {
  LitElement,
  html,
  customElement,
  property,
  TemplateResult
} from 'lit-element';
import { until } from 'lit-html/directives/until.js';
import {
  CSSPropertyInfo,
  PropertyInfo,
  SlotInfo,
  EventInfo
} from './lib/types.js';

import './api-viewer-demo-layout.js';

@customElement('api-viewer-demo')
export class ApiViewerDemo extends LitElement {
  @property() name = '';

  @property({ attribute: false })
  props: PropertyInfo[] = [];

  @property({ attribute: false })
  slots: SlotInfo[] = [];

  @property({ attribute: false })
  events: EventInfo[] = [];

  @property({ attribute: false })
  cssProps: CSSPropertyInfo[] = [];

  @property() exclude = '';

  @property({ type: Number }) vid?: number;

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
        .cssProps="${this.cssProps}"
        .exclude="${this.exclude}"
        .vid="${this.vid}"
      ></api-viewer-demo-layout>
    `;
  }

  protected createRenderRoot() {
    return this;
  }

  protected render(): TemplateResult {
    const { name } = this;

    if (name && this.lastName !== name) {
      this.lastName = name;
      this.whenDefined = customElements.whenDefined(name);
    }

    return html`
      ${until(
        this.renderDemoLayout(this.whenDefined),
        html`
          <div part="warning">
            Element "${this.name}" is not defined. Have you imported it?
          </div>
        `
      )}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'api-viewer-demo': ApiViewerDemo;
  }
}
