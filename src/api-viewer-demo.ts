import type * as Manifest from 'custom-elements-manifest/schema';
import type { TemplateResult } from 'lit';

import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { until } from 'lit/directives/until.js';

import './api-viewer-demo-layout.js';
import { Prop } from './lib/types.js';

@customElement('api-viewer-demo')
export class ApiViewerDemo extends LitElement {
  @property() name = '';

  @property({ attribute: false })
  members: Prop[] = [];

  @property({ attribute: false })
  slots: Manifest.Slot[] = [];

  @property({ attribute: false })
  events: Manifest.Event[] = [];

  @property({ attribute: false })
  cssProps: Manifest.CssCustomProperty[] = [];

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
        .tag=${this.name}
        .members=${this.members}
        .slots=${this.slots}
        .events=${this.events}
        .cssProps=${this.cssProps}
        .exclude=${this.exclude}
        .vid=${this.vid}
      ></api-viewer-demo-layout>
    `;
  }

  protected createRenderRoot(): this {
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
            Element ${this.name} is not defined. Have you imported it?
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
