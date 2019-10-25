import { LitElement, html, customElement, css, property } from 'lit-element';
import { PropertyInfo, SlotInfo, KnobValues } from './lib/types.js';
import { EMPTY_PROP_INFO, EMPTY_SLOT_INFO } from './lib/constants.js';
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
        .slots="${this.slots}"
        @prop-changed="${this._onPropChanged}"
        @slot-changed="${this._onSlotChanged}"
      ></api-viewer-demo-knobs>
    `;
  }

  protected firstUpdated() {
    if (this.slots) {
      this.processedSlots = this.slots.map((slot: SlotInfo) => {
        const { name } = slot;
        const result = slot;
        result.content =
          name === '' ? 'Default' : name[0].toUpperCase() + name.slice(1);
        return result;
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
      const result = slot;
      if (slot.name === name) {
        result.content = content;
      }
      return result;
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
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'api-viewer-demo-layout': ApiViewerDemoLayout;
  }
}
