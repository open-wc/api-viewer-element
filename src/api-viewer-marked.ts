import { LitElement, html, customElement, property } from 'lit-element';
import { nothing, TemplateResult } from 'lit-html';
import { unsafeHTML } from 'lit-html/directives/unsafe-html.js';
import 'marked';
import DOMPurify from 'dompurify';

const { marked } = window;

const parse = (markdown?: string): TemplateResult => {
  if (!markdown) {
    return html`
      ${nothing}
    `;
  }

  return html`
    ${unsafeHTML(DOMPurify.sanitize(marked.parse(markdown)))}
  `;
};

@customElement('api-viewer-marked')
export class ApiViewerMarked extends LitElement {
  @property({ type: String }) content?: string | undefined;

  protected createRenderRoot() {
    return this;
  }

  protected render() {
    return html`
      ${parse(this.content)}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'api-viewer-marked': ApiViewerMarked;
  }
}
