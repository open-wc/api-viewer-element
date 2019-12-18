import { html } from 'lit-element';
import { nothing, TemplateResult } from 'lit-html';
import { unsafeHTML } from 'lit-html/directives/unsafe-html.js';
import marked from 'marked/lib/marked.esm.js';
import DOMPurify from 'dompurify';

export const parse = (markdown?: string): TemplateResult => {
  if (!markdown) {
    return html`
      ${nothing}
    `;
  }

  return html`
    ${unsafeHTML(DOMPurify.sanitize(marked(markdown)))}
  `;
};
