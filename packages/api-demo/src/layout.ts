import {
  html,
  LitElement,
  type PropertyValues,
  type TemplateResult
} from 'lit';
import { property } from 'lit/decorators/property.js';
import { cache } from 'lit/directives/cache.js';
import type {
  ClassField,
  CssCustomProperty,
  Event,
  Slot
} from '@api-viewer/common/lib/index.js';
import {
  hasTemplate,
  TemplateTypes
} from '@api-viewer/common/lib/templates.js';
import '@api-viewer/tabs';
import { EventsController } from './controllers/events-controller.js';
import { SlotsController } from './controllers/slots-controller.js';
import { StylesController } from './controllers/styles-controller.js';
import { renderEvents } from './ui/events.js';
import { renderSnippet } from './ui/snippet.js';
import { getCustomKnobs, getInitialKnobs, getKnobs } from './ui/knobs.js';
import { renderer } from './ui/renderer.js';
import {
  cssPropRenderer,
  propRenderer,
  renderKnobs,
  slotRenderer
} from './ui/controls.js';
import type {
  ComponentWithProps,
  Knob,
  KnobValue,
  PropertyKnob
} from './types.js';

class ApiDemoLayout extends LitElement {
  @property() copyBtnText = 'copy';

  @property({ attribute: false })
  cssProps: CssCustomProperty[] = [];

  @property({ attribute: false })
  events: Event[] = [];

  @property({ attribute: false })
  slots: Slot[] = [];

  @property() tag = '';

  @property({ attribute: false })
  props: ClassField[] = [];

  @property() exclude = '';

  @property({ type: Number }) vid?: number;

  @property({ attribute: false })
  customKnobs!: PropertyKnob[];

  @property({ attribute: false })
  knobs!: Record<string, Knob>;

  @property({ attribute: false })
  propKnobs!: PropertyKnob[];

  @property({ type: Boolean })
  private defined = false;

  private eventsController!: EventsController;

  private slotsController!: SlotsController;

  private stylesController!: StylesController;

  protected createRenderRoot(): this {
    return this;
  }

  protected render(): TemplateResult {
    const { tag } = this;

    if (!this.defined) {
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
    const log = this.eventsController?.data || [];
    const slots = this.slotsController?.data || [];
    const cssProps = this.stylesController?.data || [];
    const hideSlots = noSlots || hasTemplate(id, tag, TemplateTypes.SLOT);
    const hideKnobs = noProps && noCustomKnobs;

    return html`
      <div part="demo-output" @rendered=${this.onRendered}>
        ${renderer({ id, tag, knobs: this.knobs })}
      </div>
      <api-viewer-tabs part="demo-tabs">
        <api-viewer-tab slot="tab" part="tab">Source</api-viewer-tab>
        <api-viewer-panel slot="panel" part="tab-panel">
          <button @click=${this._onCopyClick} part="button">
            ${this.copyBtnText}
          </button>
          <div part="demo-snippet">
            ${renderSnippet(id, tag, this.knobs, slots, cssProps)}
          </div>
        </api-viewer-panel>
        <api-viewer-tab slot="tab" part="tab" ?hidden=${hideKnobs && hideSlots}>
          Knobs
        </api-viewer-tab>
        <api-viewer-panel slot="panel" part="tab-panel">
          <div part="knobs">
            <section
              ?hidden=${hideKnobs}
              part="knobs-column"
              @change=${this._onPropChanged}
            >
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
        <api-viewer-tab slot="tab" part="tab" ?hidden=${noCss}>
          Styles
        </api-viewer-tab>
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
        <api-viewer-tab id="events" slot="tab" part="tab" ?hidden=${noEvents}>
          Events
        </api-viewer-tab>
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
      const { tag } = this;
      this.defined = !!customElements.get(tag);

      if (!this.defined) {
        // Change `defined` to render demo once the component is imported lazily
        // and becomes defined, but only if the corresponding tag is selected.
        customElements.whenDefined(tag).then(() => {
          if (this.tag === tag) {
            this.defined = true;
          }
        });
      }

      this.knobs = {};
      this.propKnobs = getKnobs(this.tag, this.props, this.exclude);
      this.customKnobs = getCustomKnobs(this.tag, this.vid);
    }
  }

  protected updated(props: PropertyValues): void {
    // Reset the focused tab
    if (props.has('tag') && props.get('tag')) {
      const tabs = this.renderRoot.querySelector('api-viewer-tabs');
      if (tabs) {
        tabs.selectFirst();
      }
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
      controller.destroy();
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
      controller.destroy();
    }

    this.slotsController = new SlotsController(
      this,
      component,
      this.vid as number,
      this.slots
    );
  }

  private initStyles(component: HTMLElement) {
    const controller = this.stylesController;
    if (controller) {
      controller.destroy();
    }

    this.stylesController = new StylesController(
      this,
      component,
      this.cssProps
    );
  }

  getKnob(name: string): {
    knob: PropertyKnob;
    custom?: boolean;
  } {
    const isMatch = (prop: PropertyKnob): boolean =>
      prop.name === name || prop.attribute === name;
    let knob = this.propKnobs.find(isMatch);
    let custom = false;
    if (!knob) {
      knob = this.customKnobs.find(isMatch) as PropertyKnob;
      custom = true;
    }
    return { knob, custom };
  }

  private setKnobs(
    name: string,
    knobType: string,
    value: KnobValue,
    attribute: string | undefined,
    custom = false
  ): void {
    this.knobs = {
      ...this.knobs,
      [name]: {
        knobType,
        value,
        attribute,
        custom
      }
    };
  }

  syncKnob(component: Element, changed: PropertyKnob): void {
    const { name, knobType, attribute } = changed;
    const value = (component as unknown as ComponentWithProps)[name];

    // update knobs to avoid duplicate event
    this.setKnobs(name, knobType, value, attribute);

    this.propKnobs = this.propKnobs.map((prop) =>
      prop.name === name ? { ...prop } : prop
    );
  }

  private _onCssChanged(e: CustomEvent): void {
    const target = e.composedPath()[0] as HTMLInputElement;
    this.stylesController.setValue(target.dataset.name as string, target.value);
  }

  private _onPropChanged(e: CustomEvent): void {
    const target = e.composedPath()[0] as HTMLInputElement;

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
    this.setKnobs(
      name as string,
      type as string,
      value,
      knob.attribute,
      custom
    );
  }

  private _onSlotChanged(e: CustomEvent): void {
    const target = e.composedPath()[0] as HTMLInputElement;
    this.slotsController.setValue(target.dataset.slot as string, target.value);
  }
}

customElements.define('api-demo-layout', ApiDemoLayout);

declare global {
  interface HTMLElementTagNameMap {
    'api-demo-layout': ApiDemoLayout;
  }
}
