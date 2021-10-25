import { html, nothing, TemplateResult } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import marked from 'marked/lib/marked.esm.js';
import DOMPurify from 'dompurify';

marked.setOptions({ headerIds: false });

export const parse = (markdown?: string): TemplateResult =>
  html`
    ${!markdown
      ? nothing
      : unsafeHTML(
          DOMPurify.sanitize(marked(markdown)).replace(
            /<(h[1-6]|a|p|ul|ol|li|pre|code|strong|em|blockquote|del)(\s+href="[^"]+")*>/g,
            '<$1 part="md-$1"$2>'
          )
        )}
  `;
