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
  PropertyInfo,
  SlotInfo,
  EventInfo,
  KnobValues
} from './lib/types.js';
import {
  EMPTY_PROP_INFO,
  EMPTY_SLOT_INFO,
  EMPTY_EVT_INFO
} from './lib/constants.js';
import { getSlotTitle } from './lib/utils.js';
import './api-viewer-demo-renderer.js';
import './api-viewer-demo-knobs.js';
import './api-viewer-demo-snippet.js';

@customElement('api-viewer-demo-layout')
export class ApiViewerDemoLayout extends LitElement {
  @property({ type: String }) tag = '';

  @property({ attribute: false, hasChanged: () => true })
  props: PropertyInfo[] = EMPTY_PROP_INFO;

  @property({ attribute: false, hasChanged: () => true })
  slots: SlotInfo[] = EMPTY_SLOT_INFO;

  @property({ attribute: false, hasChanged: () => true })
  events: EventInfo[] = EMPTY_EVT_INFO;

  @property({ attribute: false, hasChanged: () => true })
  protected processedSlots: SlotInfo[] = EMPTY_SLOT_INFO;

  @property({ attribute: false, hasChanged: () => true })
  knobs: KnobValues = {};

  static get styles() {
    return css`
      :host {
        display: block;
      }
    `;
  }

  protected render() {
    return html`
      <api-viewer-demo-renderer
        .tag="${this.tag}"
        .knobs="${this.knobs}"
        .slots="${this.processedSlots}"
        @rendered="${this._onRendered}"
      ></api-viewer-demo-renderer>
      <api-viewer-demo-snippet
        .tag="${this.tag}"
        .knobs="${this.knobs}"
        .slots="${this.processedSlots}"
      ></api-viewer-demo-snippet>
      <api-viewer-demo-knobs
        .props="${this.props}"
        .slots="${this.processedSlots}"
        @prop-changed="${this._onPropChanged}"
        @slot-changed="${this._onSlotChanged}"
      ></api-viewer-demo-knobs>
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
      const { name } = event;
      const s = '-changed';
      if (name.endsWith(s) && props.some(prop => name === `${prop.name}${s}`)) {
        this._listenKnob(component, name, name.replace(s, ''));
      }
    });
  }

  private _listenKnob(component: Element, event: string, name: string) {
    component.addEventListener(event, () => {
      const { props } = this;
      const { type } = props.find(p => p.name === name) as PropertyInfo;
      const value = ((component as unknown) as ComponentWithProps)[name];

      // update knobs to avoid duplicate event
      this.knobs = Object.assign(this.knobs, { [name]: { type, value } });

      this.props = props.map(prop => {
        return prop.name === name
          ? {
              ...prop,
              value
            }
          : prop;
      });
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'api-viewer-demo-layout': ApiViewerDemoLayout;
  }
}
