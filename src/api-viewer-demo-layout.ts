import { LitElement, html, TemplateResult } from 'lit';
import { property } from 'lit/decorators/property.js';
import { cache } from 'lit/directives/cache.js';
import { renderEvents } from './lib/demo-events.js';
import { renderSnippet } from './lib/demo-snippet.js';
import { renderer } from './lib/renderer.js';
import {
  cssPropRenderer,
  propRenderer,
  renderKnobs,
  slotRenderer
} from './lib/knobs.js';
import { hasTemplate, TemplateTypes } from './lib/utils.js';
import { ApiDemoLayoutMixin } from './api-demo-layout-mixin.js';
import './api-viewer-panel.js';
import './api-viewer-tab.js';
import './api-viewer-tabs.js';

class ApiViewerDemoLayout extends ApiDemoLayoutMixin(LitElement) {
  @property() copyBtnText = 'copy';

  protected createRenderRoot(): this {
    return this;
  }

  protected render(): TemplateResult {
    const [noCss, noEvents, noSlots, noCustomKnobs, noProps] = [
      this.cssProps,
      this.events,
      this.slots,
      this.customKnobs,
      this.props
    ].map((arr) => arr.length === 0);

    const id = this.vid as number;
    const log = this.eventLog;
    const slots = this.processedSlots;
    const hideSlots = noSlots || hasTemplate(id, this.tag, TemplateTypes.SLOT);

    return html`
      <div part="demo-output" @rendered="${this.onRendered}">
        ${renderer({
          id,
          tag: this.tag,
          knobs: this.knobs,
          slots,
          cssProps: this.processedCss
        })}
      </div>
      <api-viewer-tabs part="demo-tabs">
        <api-viewer-tab heading="Source" slot="tab" part="tab"></api-viewer-tab>
        <api-viewer-panel slot="panel" part="tab-panel">
          <button @click="${this._onCopyClick}" part="button">
            ${this.copyBtnText}
          </button>
          <div part="demo-snippet">
            ${renderSnippet(
              this.vid as number,
              this.tag,
              this.knobs,
              slots,
              this.processedCss
            )}
          </div>
        </api-viewer-panel>
        <api-viewer-tab
          heading="Knobs"
          slot="tab"
          part="tab"
          ?hidden="${noProps && noCustomKnobs && hideSlots}"
        ></api-viewer-tab>
        <api-viewer-panel slot="panel" part="tab-panel">
          <div part="knobs">
            <section part="knobs-column" @change="${this._onPropChanged}">
              ${renderKnobs(this.props, 'Properties', 'prop', propRenderer)}
              ${renderKnobs(
                this.customKnobs,
                'Attributes',
                'attr',
                propRenderer
              )}
            </section>
            <section
              ?hidden="${hideSlots}"
              part="knobs-column"
              @change="${this._onSlotChanged}"
            >
              ${renderKnobs(slots, 'Slots', 'slot', slotRenderer)}
            </section>
          </div>
        </api-viewer-panel>
        <api-viewer-tab
          heading="Styles"
          slot="tab"
          part="tab"
          ?hidden="${noCss}"
        ></api-viewer-tab>
        <api-viewer-panel slot="panel" part="tab-panel">
          <div part="knobs" ?hidden="${noCss}">
            <section part="knobs-column" @change="${this._onCssChanged}">
              ${renderKnobs(
                this.cssProps,
                'Custom CSS Properties',
                'css-prop',
                cssPropRenderer
              )}
            </section>
          </div>
        </api-viewer-panel>
        <api-viewer-tab
          id="events"
          heading="Events"
          slot="tab"
          part="tab"
          ?hidden="${noEvents}"
        ></api-viewer-tab>
        <api-viewer-panel slot="panel" part="tab-panel">
          <div part="event-log" ?hidden="${noEvents}">
            <button
              @click="${this._onLogClear}"
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
          </div>
        </api-viewer-panel>
      </api-viewer-tabs>
    `;
  }

  private _onLogClear(): void {
    this.eventLog = [];
    const tab = this.renderRoot.querySelector('#events') as HTMLElement;
    if (tab) {
      tab.focus();
    }
  }

  private _onCopyClick(): void {
    const source = this.renderRoot.querySelector('[part="demo-snippet"] code');
    if (source) {
      const range = document.createRange();
      range.selectNodeContents(source);
      const selection = window.getSelection() as Selection;
      selection.removeAllRanges();
      selection.addRange(range);
      try {
        document.execCommand('copy');
        this.copyBtnText = 'done';
      } catch (err) {
        // Copy command is not available
        console.error(err);
        this.copyBtnText = 'error';
      }

      // Return to the copy button after a second.
      setTimeout(() => {
        this.copyBtnText = 'copy';
      }, 1000);

      selection.removeAllRanges();
    }
  }

  private _onCssChanged(e: CustomEvent): void {
    this.setCss(e.composedPath()[0] as HTMLInputElement);
  }

  private _onPropChanged(e: Event): void {
    this.setKnobs(e.composedPath()[0] as HTMLInputElement);
  }

  private _onSlotChanged(e: Event): void {
    this.setSlots(e.composedPath()[0] as HTMLInputElement);
  }
}

customElements.define('api-viewer-demo-layout', ApiViewerDemoLayout);

declare global {
  interface HTMLElementTagNameMap {
    'api-viewer-demo-layout': ApiViewerDemoLayout;
  }
}
