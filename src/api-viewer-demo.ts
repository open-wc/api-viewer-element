import { LitElement, html, TemplateResult } from 'lit';
import { property } from 'lit/decorators/property.js';
import { cache } from 'lit/directives/cache.js';
import { EventsController } from './controllers/events-controller.js';
import { SlotsController } from './controllers/slots-controller.js';
import { StylesController } from './controllers/styles-controller.js';
import { renderEvents } from './lib/demo-events.js';
import { renderSnippet } from './lib/demo-snippet.js';
import { renderer } from './lib/renderer.js';
import {
  cssPropRenderer,
  propRenderer,
  renderKnobs,
  slotRenderer
} from './lib/knobs.js';
import { CSSPropertyInfo, EventInfo, SlotInfo } from './lib/types.js';
import { hasTemplate, TemplateTypes } from './lib/utils.js';
import { ApiDemoKnobsMixin } from './api-demo-knobs-mixin.js';
import './api-viewer-panel.js';
import './api-viewer-tab.js';
import './api-viewer-tabs.js';

class ApiViewerDemo extends ApiDemoKnobsMixin(LitElement) {
  @property() copyBtnText = 'copy';

  @property({ attribute: false })
  cssProps: CSSPropertyInfo[] = [];

  @property({ attribute: false })
  events: EventInfo[] = [];

  @property({ attribute: false })
  slots: SlotInfo[] = [];

  private _whenDefined: Record<string, Promise<unknown>> = {};

  private eventsController!: EventsController;

  private slotsController!: SlotsController;

  private stylesController!: StylesController;

  protected createRenderRoot(): this {
    return this;
  }

  protected render(): TemplateResult {
    const { tag } = this;

    // Invoke `requestUpdate` to render demo once the component is imported lazily
    // and becomes defined, but only it if matches the currently selected tag name.
    if (!customElements.get(tag)) {
      this._whenDefined[tag] = customElements.whenDefined(tag);
      this._whenDefined[tag].then(() => {
        if (this.tag === tag) {
          this.requestUpdate();
        }
      });

      return html`
        <div part="warning">
          Element ${tag} is not defined. Have you imported it?
        </div>
      `;
    }

    const [noCss, noEvents, noSlots, noCustomKnobs, noProps] = [
      this.cssProps,
      this.events,
      this.slots,
      this.customKnobs,
      this.propKnobs
    ].map((arr) => arr.length === 0);

    const id = this.vid as number;
    const log = this.eventsController?.log || [];
    const slots = this.slotsController?.slots || [];
    const cssProps = this.stylesController?.css || [];
    const hideSlots = noSlots || hasTemplate(id, tag, TemplateTypes.SLOT);

    return html`
      <div part="demo-output" @rendered=${this.onRendered}>
        ${renderer({ id, tag, knobs: this.knobs })}
      </div>
      <api-viewer-tabs part="demo-tabs">
        <api-viewer-tab heading="Source" slot="tab" part="tab"></api-viewer-tab>
        <api-viewer-panel slot="panel" part="tab-panel">
          <button @click=${this._onCopyClick} part="button">
            ${this.copyBtnText}
          </button>
          <div part="demo-snippet">
            ${renderSnippet(id, tag, this.knobs, slots, cssProps)}
          </div>
        </api-viewer-panel>
        <api-viewer-tab
          heading="Knobs"
          slot="tab"
          part="tab"
          ?hidden=${noProps && noCustomKnobs && hideSlots}
        ></api-viewer-tab>
        <api-viewer-panel slot="panel" part="tab-panel">
          <div part="knobs">
            <section part="knobs-column" @change=${this._onPropChanged}>
              ${renderKnobs(this.propKnobs, 'Properties', 'prop', propRenderer)}
              ${renderKnobs(
                this.customKnobs,
                'Attributes',
                'attr',
                propRenderer
              )}
            </section>
            <section
              ?hidden=${hideSlots}
              part="knobs-column"
              @change=${this._onSlotChanged}
            >
              ${renderKnobs(slots, 'Slots', 'slot', slotRenderer)}
            </section>
          </div>
        </api-viewer-panel>
        <api-viewer-tab
          heading="Styles"
          slot="tab"
          part="tab"
          ?hidden=${noCss}
        ></api-viewer-tab>
        <api-viewer-panel slot="panel" part="tab-panel">
          <div part="knobs" ?hidden=${noCss}>
            <section part="knobs-column" @change=${this._onCssChanged}>
              ${renderKnobs(
                cssProps,
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
          ?hidden=${noEvents}
        ></api-viewer-tab>
        <api-viewer-panel slot="panel" part="tab-panel">
          <div part="event-log" ?hidden=${noEvents}>
            <button
              @click=${this._onLogClear}
              ?hidden=${!log.length}
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
    this.eventsController.clear();
    const tab = this.querySelector('#events') as HTMLElement;
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

  private onRendered(e: CustomEvent): void {
    const { component } = e.detail;

    this.initKnobs(component);

    this.initEvents(component);

    this.initSlots(component);

    this.initStyles(component);
  }

  private initEvents(component: HTMLElement) {
    const controller = this.eventsController;
    if (controller) {
      controller.clear();
      this.removeController(controller);
    }

    this.eventsController = new EventsController(this, component, this.events);
  }

  private initSlots(component: HTMLElement) {
    const controller = this.slotsController;
    if (controller) {
      this.removeController(controller);
    }

    this.slotsController = new SlotsController(
      this,
      this.vid as number,
      component,
      this.slots
    );
  }

  private initStyles(component: HTMLElement) {
    const controller = this.stylesController;
    if (controller) {
      this.removeController(controller);
    }

    this.stylesController = new StylesController(
      this,
      component,
      this.cssProps
    );
  }

  private _onCssChanged(e: CustomEvent): void {
    const target = e.composedPath()[0] as HTMLInputElement;
    this.stylesController.setValue(target.dataset.name as string, target.value);
  }

  private _onPropChanged(e: Event): void {
    this.setKnobs(e.composedPath()[0] as HTMLInputElement);
  }

  private _onSlotChanged(e: Event): void {
    const target = e.composedPath()[0] as HTMLInputElement;
    this.slotsController.setValue(target.dataset.slot as string, target.value);
  }
}

customElements.define('api-viewer-demo', ApiViewerDemo);

declare global {
  interface HTMLElementTagNameMap {
    'api-viewer-demo': ApiViewerDemo;
  }
}
