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

    return html`
      <api-viewer-header .heading="${element.name}">
        <api-viewer-select
          .options="${tags}"
          .selected="${selected}"
        ></api-viewer-select>
      </api-viewer-header>
      <api-viewer-description
        .description="${element.description}"
      ></api-viewer-description>
      <api-viewer-content .element="${element}"></api-viewer-content>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'api-viewer-docs': ApiViewerDocs;
  }
}
