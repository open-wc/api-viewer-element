import {
  LitElement,
  html,
  customElement,
  css,
  property,
  PropertyValues
} from 'lit-element';
import {
  ComponentWithProps,
  CSSPropertyInfo,
  PropertyInfo,
  SlotInfo,
  SlotValue,
  EventInfo,
  KnobValues
} from './lib/types.js';
import { getSlotTitle, isEmptyArray } from './lib/utils.js';
import './api-viewer-demo-renderer.js';
import './api-viewer-demo-knobs.js';
import './api-viewer-demo-snippet.js';
import './api-viewer-demo-events.js';
import './api-viewer-demo-css.js';
import './api-viewer-panel.js';
import './api-viewer-tab.js';
import './api-viewer-tabs.js';

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

  @property({ attribute: false, hasChanged: () => true })
  protected processedSlots: SlotValue[] = [];

  @property({ attribute: false, hasChanged: () => true })
  protected processedCss: CSSPropertyInfo[] = [];

  @property({ attribute: false, hasChanged: () => true })
  protected eventLog: CustomEvent[] = [];

  @property({ attribute: false, hasChanged: () => true })
  knobs: KnobValues = {};

  static get styles() {
    return css`
      :host {
        display: block;
      }

      api-viewer-tabs {
        border-top: solid 1px var(--ave-border-color);
      }

      api-viewer-panel {
        box-sizing: border-box;
        background: #fafafa;
      }
    `;
  }

  protected render() {
    const noEvents = isEmptyArray(this.events);
    const noCss = isEmptyArray(this.cssProps);
    const noKnobs = isEmptyArray(this.props) && isEmptyArray(this.slots);

    return html`
      <api-viewer-demo-renderer
        .tag="${this.tag}"
        .knobs="${this.knobs}"
        .slots="${this.processedSlots}"
        .cssProps="${this.processedCss}"
        @rendered="${this._onRendered}"
      ></api-viewer-demo-renderer>
      <api-viewer-tabs>
        <api-viewer-tab heading="Source" slot="tab"></api-viewer-tab>
        <api-viewer-panel slot="panel">
          <api-viewer-demo-snippet
            .tag="${this.tag}"
            .knobs="${this.knobs}"
            .slots="${this.processedSlots}"
            .cssProps="${this.processedCss}"
          ></api-viewer-demo-snippet>
        </api-viewer-panel>
        <api-viewer-tab
          heading="Knobs"
          slot="tab"
          ?hidden="${noKnobs}"
        ></api-viewer-tab>
        <api-viewer-panel slot="panel">
          <api-viewer-demo-knobs
            .tag="${this.tag}"
            .props="${this.props}"
            .slots="${this.processedSlots}"
            @prop-changed="${this._onPropChanged}"
            @slot-changed="${this._onSlotChanged}"
            ?hidden="${noKnobs}"
          ></api-viewer-demo-knobs>
        </api-viewer-panel>
        <api-viewer-tab
          heading="Styles"
          slot="tab"
          ?hidden="${noCss}"
        ></api-viewer-tab>
        <api-viewer-panel slot="panel">
          <api-viewer-demo-css
            ?hidden="${noCss}"
            .cssProps="${this.processedCss}"
            @css-changed="${this._onCssChanged}"
          ></api-viewer-demo-css>
        </api-viewer-panel>
        <api-viewer-tab
          heading="Events"
          slot="tab"
          ?hidden="${noEvents}"
          class="events"
        ></api-viewer-tab>
        <api-viewer-panel slot="panel">
          <api-viewer-demo-events
            ?hidden="${noEvents}"
            .log="${this.eventLog}"
            @clear="${this._onLogClear}"
          ></api-viewer-demo-events>
        </api-viewer-panel>
      </api-viewer-tabs>
    `;
  }

  protected updated(props: PropertyValues) {
    super.updated(props);

    if (props.has('slots') && this.slots) {
      this.processedSlots = this.slots.map((slot: SlotInfo) => {
        return {
          ...slot,
          content: getSlotTitle(slot.name)
        };
      });
    }
  }

  private _onLogClear() {
    this.eventLog = [];
    const tab = this.renderRoot.querySelector('.events') as HTMLElement;
    if (tab) {
      tab.focus();
    }
  }

  private _onCssChanged(e: CustomEvent) {
    const { name, value } = e.detail;
    this.processedCss = this.processedCss.map(prop => {
      return prop.name === name
        ? {
            ...prop,
            value
          }
        : prop;
    });
  }

  private _onPropChanged(e: CustomEvent) {
    const { name, type, value } = e.detail;
    this.knobs = Object.assign(this.knobs, { [name]: { type, value } });
  }

  private _onSlotChanged(e: CustomEvent) {
    const { name, content } = e.detail;
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
    const { props } = this;
    // TODO: get default values from analyzer
    this.props = props.map((prop: PropertyInfo) => {
      const { name } = prop;
      const result = prop;
      if (component[name] !== undefined) {
        result.value = component[name];
      }
      return result;
    });

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
        const name = event.replace(s, '');
        const prop = this.props.find(p => p.name === name) as PropertyInfo;
        if (prop) {
          this._syncKnob(component, name, prop.type);
        }
      }

      this.eventLog.push(e);
    }) as EventListener);
  }

  private _syncKnob(component: Element, name: string, type: string) {
    const value = ((component as unknown) as ComponentWithProps)[name];

    // update knobs to avoid duplicate event
    this.knobs = Object.assign(this.knobs, { [name]: { type, value } });

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
