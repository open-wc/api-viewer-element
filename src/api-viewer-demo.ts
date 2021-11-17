import { LitElement, html, PropertyValues, TemplateResult } from 'lit';
import { property } from 'lit/decorators/property.js';
import { cache } from 'lit/directives/cache.js';
import { EventsController } from './controllers/events-controller.js';
import { SlotsController } from './controllers/slots-controller.js';
import { StylesController } from './controllers/styles-controller.js';
import { renderEvents } from './lib/demo-events.js';
import { renderSnippet } from './lib/demo-snippet.js';
import {
  getCustomKnobs,
  getInitialKnobs,
  getKnobs,
  Knob
} from './lib/knobs.js';
import { renderer } from './lib/renderer.js';
import {
  cssPropRenderer,
  propRenderer,
  renderKnobs,
  slotRenderer
} from './lib/demo-controls.js';
import {
  ComponentWithProps,
  CSSPropertyInfo,
  EventInfo,
  PropertyInfo,
  SlotInfo
} from './lib/types.js';
import { hasTemplate, isPropMatch, TemplateTypes } from './lib/utils.js';
import './api-viewer-panel.js';
import './api-viewer-tab.js';
import './api-viewer-tabs.js';

class ApiViewerDemo extends LitElement {
  @property() copyBtnText = 'copy';

  @property({ attribute: false })
  cssProps: CSSPropertyInfo[] = [];

  @property({ attribute: false })
  events: EventInfo[] = [];

  @property({ attribute: false })
  slots: SlotInfo[] = [];

  @property() tag = '';

  @property({ attribute: false })
  props: PropertyInfo[] = [];

  @property() exclude = '';

  @property({ type: Number }) vid?: number;

  @property({ attribute: false })
  customKnobs!: Knob<PropertyInfo>[];

  @property({ attribute: false })
  knobs!: Record<string, Knob>;

  @property({ attribute: false })
  propKnobs!: Knob<PropertyInfo>[];

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

  willUpdate(props: PropertyValues) {
    // Reset state if tag changed
    if (props.has('tag')) {
      this.knobs = {};
      this.propKnobs = getKnobs(this.tag, this.props, this.exclude);
      this.customKnobs = getCustomKnobs(this.tag, this.vid);
    }
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

  private initKnobs(component: HTMLElement) {
    if (hasTemplate(this.vid as number, this.tag, TemplateTypes.HOST)) {
      // Apply property values from template
      const propKnobs = getInitialKnobs(this.propKnobs, component);
      propKnobs.forEach((prop) => {
        this.syncKnob(component, prop);
      });
    }
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

  getKnob(name: string): {
    knob: Knob<PropertyInfo>;
    custom?: boolean;
  } {
    const isMatch = isPropMatch(name);
    let knob = this.propKnobs.find(isMatch);
    let custom = false;
    if (!knob) {
      knob = this.customKnobs.find(isMatch) as Knob<PropertyInfo>;
      custom = true;
    }
    return { knob, custom };
  }

  setKnobs(target: HTMLInputElement): void {
    const { name, type } = target.dataset;
    let value;
    switch (type) {
      case 'boolean':
        value = target.checked;
        break;
      case 'number':
        value = target.value === '' ? null : Number(target.value);
        break;
      default:
        value = target.value;
    }

    const { knob, custom } = this.getKnob(name as string);
    if (knob) {
      const { attribute } = knob;
      this.knobs = {
        ...this.knobs,
        [name as string]: {
          knobType: type,
          value,
          attribute,
          custom
        } as Knob<PropertyInfo>
      };
    }
  }

  private syncKnob(component: Element, changed: Knob<PropertyInfo>): void {
    const { name, knobType, attribute } = changed;
    const value = (component as unknown as ComponentWithProps)[name];

    // update knobs to avoid duplicate event
    this.knobs = {
      ...this.knobs,
      [name]: { knobType, value, attribute }
    };

    this.propKnobs = this.propKnobs.map((prop) => {
      return prop.name === name
        ? {
            ...prop,
            value
          }
        : prop;
    });
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
