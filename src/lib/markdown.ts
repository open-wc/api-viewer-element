import { html, nothing, TemplateResult } from 'lit-html';
import { unsafeHTML } from 'lit-html/directives/unsafe-html.js';
import 'marked';
import DOMPurify from 'dompurify';

const { marked } = window;

export const parse = (markdown?: string): TemplateResult => {
  if (!markdown) {
    return html`
      ${nothing}
    `;
  }

  return html`
    ${unsafeHTML(DOMPurify.sanitize(marked.parse(markdown)))}
  `;
};
