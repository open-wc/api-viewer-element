import { LitElement, html, customElement, property } from 'lit-element';
import { ElementInfo } from './lib/types.js';
import { EMPTY_ELEMENT } from './lib/constants.js';
import './api-viewer-demo.js';

@customElement('api-demo-content')
export class ApiDemoContent extends LitElement {
  @property({ attribute: false }) elements: ElementInfo[] = [];

  @property({ type: Number }) selected = 0;

  @property({ type: String }) exclude = '';

  @property({ type: Number }) vid?: number;

  protected createRenderRoot() {
    return this;
  }

  protected render() {
    const { elements, selected, exclude, vid } = this;

    const { name, properties, slots, events, cssProperties } = {
      ...EMPTY_ELEMENT,
      ...(elements[selected] || {})
    };

    // TODO: analyzer should sort CSS custom properties
    const cssProps = (cssProperties || []).sort((a, b) =>
      a.name > b.name ? 1 : -1
    );

    return html`
      <header part="header">
        <div part="header-title">&lt;${name}&gt;</div>
        <nav>
          <label part="select-label">
            <select
              @change="${this._onSelect}"
              .value="${String(selected)}"
              ?hidden="${elements.length === 1}"
              part="select"
            >
              ${elements.map((tag, idx) => {
                return html`
                  <option value="${idx}">${tag.name}</option>
                `;
              })}
            </select>
          </label>
        </nav>
      </header>
      <api-viewer-demo
        .name="${name}"
        .props="${properties}"
        .slots="${slots}"
        .events="${events}"
        .cssProps="${cssProps}"
        .exclude="${exclude}"
        .vid="${vid}"
      ></api-viewer-demo>
    `;
  }

  private _onSelect(e: CustomEvent) {
    this.selected = Number((e.target as HTMLSelectElement).value);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'api-demo-content': ApiDemoContent;
  }
}
