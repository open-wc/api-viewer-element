import { html } from 'lit-element';
import { nothing, TemplateResult } from 'lit-html';
import { unsafeHTML } from 'lit-html/directives/unsafe-html.js';
import marked from 'marked/lib/marked.esm.js';
import DOMPurify from 'dompurify';

marked.setOptions({ headerIds: false });

export const parse = (markdown?: string): TemplateResult => {
  if (!markdown) {
    return html`
      ${nothing}
    `;
  }

  return html`
    ${unsafeHTML(
      DOMPurify.sanitize(marked(markdown)).replace(
        /<(h([1-6])|a|p|ul|ol|li|pre|code|strong|em|blockquote|del)*(\s+href="[^"]+")*>/g,
        '<$1 part="md-$1"$3>'
      )
    )}
  `;
};
