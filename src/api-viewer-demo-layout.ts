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
import { getSlotTitle } from './lib/utils.js';
import './api-viewer-demo-renderer.js';
import './api-viewer-demo-knobs.js';
import './api-viewer-demo-snippet.js';
import './api-viewer-demo-events.js';
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
  protected processedSlots: SlotInfo[] = [];

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
    return html`
      <api-viewer-demo-renderer
        .tag="${this.tag}"
        .knobs="${this.knobs}"
        .slots="${this.processedSlots}"
        @rendered="${this._onRendered}"
      ></api-viewer-demo-renderer>
      <api-viewer-tabs>
        <api-viewer-tab heading="Source" slot="tab"></api-viewer-tab>
        <api-viewer-panel slot="panel">
          <api-viewer-demo-snippet
            .tag="${this.tag}"
            .knobs="${this.knobs}"
            .slots="${this.processedSlots}"
          ></api-viewer-demo-snippet>
        </api-viewer-panel>
        <api-viewer-tab heading="Knobs" slot="tab"></api-viewer-tab>
        <api-viewer-panel slot="panel">
          <api-viewer-demo-knobs
            .tag="${this.tag}"
            .props="${this.props}"
            .slots="${this.processedSlots}"
            @prop-changed="${this._onPropChanged}"
            @slot-changed="${this._onSlotChanged}"
          ></api-viewer-demo-knobs>
        </api-viewer-panel>
        <api-viewer-tab heading="Events" slot="tab"></api-viewer-tab>
        <api-viewer-panel slot="panel">
          <api-viewer-demo-events
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
