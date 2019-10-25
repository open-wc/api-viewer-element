import { LitElement, html, customElement, css, property } from 'lit-element';
import { PropertyInfo, KnobValues } from './lib/types.js';
import { EMPTY_PROP_INFO } from './lib/constants.js';
import './api-viewer-demo-renderer.js';
import './api-viewer-demo-knobs.js';

@customElement('api-viewer-demo-layout')
export class ApiViewerDemoLayout extends LitElement {
  @property({ type: String }) tag = '';

  @property({ attribute: false, hasChanged: () => true })
  props: PropertyInfo[] = EMPTY_PROP_INFO;

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
      ></api-viewer-demo-renderer>
      <api-viewer-demo-knobs
        .props="${this.props}"
        @knob-changed="${this._onKnobChanged}"
      ></api-viewer-demo-knobs>
    `;
  }

  private _onKnobChanged(e: CustomEvent) {
    const { name, type, value } = e.detail;
    this.knobs = Object.assign(this.knobs, { [name]: { type, value } });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'api-viewer-demo-layout': ApiViewerDemoLayout;
  }
}
