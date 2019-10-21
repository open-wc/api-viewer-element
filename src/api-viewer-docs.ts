import { LitElement, html, customElement, css, property } from 'lit-element';
import { ElementInfo } from './lib/types.js';
import { EMPTY_ELEMENTS, EMPTY_ELEMENT } from './lib/constants.js';
import './api-viewer-content.js';
import './api-viewer-description.js';
import './api-viewer-header.js';
import './api-viewer-select.js';

@customElement('api-viewer-docs')
export class ApiViewerDocs extends LitElement {
  @property({ attribute: false }) elements: ElementInfo[] = EMPTY_ELEMENTS;

  @property({ type: Number }) selected = 0;

  static get styles() {
    return css`
      :host {
        display: block;
      }
    `;
  }

  render() {
    const { elements, selected } = this;
    const tags = elements.map((tag: ElementInfo) => tag.name);

    const element = EMPTY_ELEMENT;
    if (elements[selected]) {
      Object.assign(element, elements[selected]);
    }

    const {
      name,
      description,
      properties,
      attributes,
      slots,
      events
    } = element;

    return html`
      <api-viewer-header .heading="${name}">
        <api-viewer-select
          .options="${tags}"
          .selected="${selected}"
          @selected-changed="${this._onSelect}"
        ></api-viewer-select>
      </api-viewer-header>
      <api-viewer-description
        .description="${description}"
      ></api-viewer-description>
      <api-viewer-content
        .name="${name}"
        .props="${properties}"
        .attrs="${attributes}"
        .events="${events}"
        .slots="${slots}"
      ></api-viewer-content>
    `;
  }

  private _onSelect(e: CustomEvent) {
    const { selected } = e.detail;
    this.selected = this.elements.findIndex(el => el.name === selected);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'api-viewer-docs': ApiViewerDocs;
  }
}
