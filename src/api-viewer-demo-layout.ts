import {
  LitElement,
  html,
  customElement,
  property,
  PropertyValues
} from 'lit-element';
import { renderer } from './lib/renderer.js';
import {
  ComponentWithProps,
  CSSPropertyInfo,
  PropertyInfo,
  SlotInfo,
  SlotValue,
  EventInfo,
  KnobValues
} from './lib/types.js';
import {
  cssPropRenderer,
  propRenderer,
  renderKnobs,
  slotRenderer
} from './lib/knobs.js';
import {
  getSlotTitle,
  hasHostTemplate,
  hasSlotTemplate,
  isEmptyArray,
  normalizeType
} from './lib/utils.js';
import './api-viewer-demo-snippet.js';
import './api-viewer-demo-events.js';
import './api-viewer-panel.js';
import './api-viewer-tab.js';
import './api-viewer-tabs.js';

const getDefault = (
  prop: PropertyInfo
): string | number | boolean | null | undefined => {
  switch (normalizeType(prop.type)) {
    case 'boolean':
      return prop.default !== 'false';
    case 'number':
      return Number(prop.default);
    default:
      return prop.default;
  }
};

type CustomElement = new () => HTMLElement;

// TODO: remove when analyzer outputs "readOnly" to JSON
const isGetter = (element: Element, prop: string): boolean => {
  function getDescriptor(obj: CustomElement): PropertyDescriptor | undefined {
    return obj === HTMLElement
      ? undefined
      : Object.getOwnPropertyDescriptor(obj.prototype, prop) ||
          getDescriptor(Object.getPrototypeOf(obj));
  }

  if (element) {
    const descriptor = getDescriptor(element.constructor as CustomElement);
    return Boolean(
      descriptor && descriptor.get && descriptor.set === undefined
    );
  }

  return false;
};

@customElement('api-viewer-demo-layout')
export class ApiViewerDemoLayout extends LitElement {
  @property({ type: String }) tag = '';

  @property({ attribute: false, hasChanged: () => true })
  props: PropertyInfo[] = [];

  @property({ attribute: false, hasChanged: () => true })
  slots: SlotInfo[] = [];

  @property({ attribute: false, hasChanged: () => true })
  events: EventInfo[] = [];

  @property({ attribute: false, hasChanged: () => true })
  cssProps: CSSPropertyInfo[] = [];

  @property({ type: String }) exclude = '';

  @property({ type: Number }) vid?: number;

  @property({ attribute: false, hasChanged: () => true })
  protected processedSlots: SlotValue[] = [];

  @property({ attribute: false, hasChanged: () => true })
  protected processedCss: CSSPropertyInfo[] = [];

  @property({ attribute: false, hasChanged: () => true })
  protected eventLog: CustomEvent[] = [];

  @property({ attribute: false, hasChanged: () => true })
  knobs: KnobValues = {};

  @property({ type: String }) protected copyBtnText = 'copy';

  private _savedProps: PropertyInfo[] = [];

  protected createRenderRoot() {
    return this;
  }

  protected render() {
    const noEvents = isEmptyArray(this.events);
    const noCss = isEmptyArray(this.cssProps);
    const noSlots = isEmptyArray(this.slots);
    const noKnobs = isEmptyArray(this.props) && noSlots;
    const id = this.vid as number;

    return html`
      <div part="demo-output" @rendered="${this._onRendered}">
        ${renderer(
          id,
          this.tag,
          this.knobs,
          this.processedSlots,
          this.processedCss
        )}
      </div>
      <api-viewer-tabs part="demo-tabs">
        <api-viewer-tab heading="Source" slot="tab" part="tab"></api-viewer-tab>
        <api-viewer-panel slot="panel" part="tab-panel">
          <button @click="${this._onCopyClick}" part="button">
            ${this.copyBtnText}
          </button>
          <api-viewer-demo-snippet
            .tag="${this.tag}"
            .knobs="${this.knobs}"
            .slots="${this.processedSlots}"
            .cssProps="${this.processedCss}"
            .vid="${this.vid}"
          ></api-viewer-demo-snippet>
        </api-viewer-panel>
        <api-viewer-tab
          heading="Knobs"
          slot="tab"
          part="tab"
          ?hidden="${noKnobs}"
        ></api-viewer-tab>
        <api-viewer-panel slot="panel" part="tab-panel">
          <div part="knobs" ?hidden="${noKnobs}">
            <section part="knobs-column" @change="${this._onPropChanged}">
              <h3 part="knobs-header">Properties</h3>
              ${renderKnobs(this.props, 'prop', propRenderer)}
            </section>
            <section
              ?hidden="${hasSlotTemplate(id, this.tag) || noSlots}"
              part="knobs-column"
              @change="${this._onSlotChanged}"
            >
              <h3 part="knobs-header">Slots</h3>
              ${renderKnobs(this.processedSlots, 'slot', slotRenderer)}
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
              <h3 part="knobs-header">Custom CSS Properties</h3>
              ${renderKnobs(this.cssProps, 'css-prop', cssPropRenderer)}
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
          <api-viewer-demo-events
            ?hidden="${noEvents}"
            .log="${this.eventLog}"
            @clear="${this._onLogClear}"
            part="event-log"
          ></api-viewer-demo-events>
        </api-viewer-panel>
      </api-viewer-tabs>
    `;
  }

  protected firstUpdated(props: PropertyValues) {
    // When a selected tag name is changed by the user,
    // the whole api-viewer-demo component is re-rendered,
    // so this callback is invoked again for new element.
    if (props.has('props')) {
      const element = document.createElement(this.tag);
      // Store properties without getters
      this._savedProps = this.props.filter(
        ({ name }) => !isGetter(element, name)
      );
    }
  }

  protected updated(props: PropertyValues) {
    if (props.has('exclude')) {
      this.props = this._filterProps();
    }

    if (props.has('slots') && this.slots) {
      this.processedSlots = this.slots
        .sort((a: SlotInfo, b: SlotInfo) => {
          if (a.name === '') {
            return 1;
          }
          if (b.name === '') {
            return -1;
          }
          return a.name.localeCompare(b.name);
        })
        .map((slot: SlotInfo) => {
          return {
            ...slot,
            content: getSlotTitle(slot.name)
          };
        });
    }
  }

  private _filterProps() {
    const exclude = this.exclude.split(',');
    return this._savedProps
      .filter(({ name }) => !exclude.includes(name))
      .map((prop: PropertyInfo) => {
        return typeof prop.default === 'string'
          ? {
              ...prop,
              value: getDefault(prop)
            }
          : prop;
      });
  }

  private _getProp(name: string) {
    return this.props.find(
      p => p.attribute === name || p.name === name
    ) as PropertyInfo;
  }

  private _onLogClear() {
    this.eventLog = [];
    const tab = this.renderRoot.querySelector('#events') as HTMLElement;
    if (tab) {
      tab.focus();
    }
  }

  private _onCopyClick() {
    const snippet = this.renderRoot.querySelector('api-viewer-demo-snippet');
    if (snippet && snippet.source) {
      const range = document.createRange();
      range.selectNodeContents(snippet.source);
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

  private _onCssChanged(e: CustomEvent) {
    const target = e.composedPath()[0] as HTMLInputElement;
    const { value, dataset } = target;
    const { name } = dataset;

    this.processedCss = this.processedCss.map(prop => {
      return prop.name === name
        ? {
            ...prop,
            value
          }
        : prop;
    });
  }

  private _onPropChanged(e: Event) {
    const target = e.composedPath()[0] as HTMLInputElement;
    const { name, type } = target.dataset;
    let value;
    switch (normalizeType(type)) {
      case 'boolean':
        value = target.checked;
        break;
      case 'number':
        value = target.value === '' ? null : Number(target.value);
        break;
      default:
        value = target.value;
    }

    const { attribute } = this._getProp(name as string);
    this.knobs = Object.assign(this.knobs, {
      [name as string]: { type, value, attribute }
    });
  }

  private _onSlotChanged(e: Event) {
    const target = e.composedPath()[0] as HTMLInputElement;
    const name = target.dataset.slot;
    const content = target.value;

    this.processedSlots = this.processedSlots.map(slot => {
      return slot.name === name
        ? {
            ...slot,
            content
          }
        : slot;
    });
  }

  private _onRendered(e: CustomEvent) {
    const { component } = e.detail;

    if (hasHostTemplate(this.vid as number, this.tag)) {
      // Apply property values from template
      this.props
        .filter(prop => {
          const { name, type } = prop;
          const defaultValue = getDefault(prop);
          return (
            component[name] !== defaultValue ||
            (normalizeType(type) === 'boolean' && defaultValue)
          );
        })
        .forEach(prop => {
          this._syncKnob(component, prop);
        });
    }

    this.events.forEach(event => {
      this._listen(component, event.name);
    });

    if (this.cssProps.length) {
      const style = getComputedStyle(component);

      this.processedCss = this.cssProps.map(cssProp => {
        let value = style.getPropertyValue(cssProp.name);
        const result = cssProp;
        if (value) {
          value = value.trim();
          result.defaultValue = value;
          result.value = value;
        }
        return result;
      });
    }
  }

  private _listen(component: Element, event: string) {
    component.addEventListener(event, ((e: CustomEvent) => {
      const s = '-changed';
      if (event.endsWith(s)) {
        const prop = this._getProp(event.replace(s, ''));
        if (prop) {
          this._syncKnob(component, prop);
        }
      }

      this.eventLog.push(e);
    }) as EventListener);
  }

  private _syncKnob(component: Element, changed: PropertyInfo) {
    const { name, type, attribute } = changed;
    const value = ((component as unknown) as ComponentWithProps)[name];

    // update knobs to avoid duplicate event
    this.knobs = Object.assign(this.knobs, {
      [name]: { type, value, attribute }
    });

    this.props = this.props.map(prop => {
      return prop.name === name
        ? {
            ...prop,
            value
          }
        : prop;
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'api-viewer-demo-layout': ApiViewerDemoLayout;
  }
}
