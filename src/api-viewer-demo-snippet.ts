import {
  LitElement,
  html,
  customElement,
  css,
  property,
  TemplateResult
} from 'lit-element';
import { unsafeHTML } from 'lit-html/directives/unsafe-html.js';
import 'prismjs';
import { KnobValues, KnobValue, SlotInfo } from './lib/types.js';
import { EMPTY_SLOT_INFO } from './lib/constants.js';
import prismTheme from './lib/prism-theme.js';

const { highlight, languages } = window.Prism;

declare global {
  interface Window {
    Prism: typeof import('prismjs');
  }
}

const renderSnippet = (
  tag: string,
  values: KnobValues,
  slots: SlotInfo[]
): TemplateResult => {
  let markup = `<${tag}`;
  Object.keys(values).forEach((key: string) => {
    const knob: KnobValue = values[key];
    switch (knob.type) {
      case 'boolean':
        markup += knob.value ? ` ${key}` : '';
        break;
      default:
        markup += ` ${key}="${knob.value}"`;
        break;
    }
  });

  markup += `>`;

  if (slots.length) {
    slots.forEach(slot => {
      const { name, content } = slot;
      const div = name ? `<div slot="${name}">` : '<div>';
      markup += `\n\t${div}${content}</div>`;
    });
    markup += `\n`;
  }

  markup += `</${tag}>`;

  const snippet = unsafeHTML(highlight(markup, languages.markup, 'html'));

  return html`
    <pre><code>${snippet}</code></pre>
  `;
};

@customElement('api-viewer-demo-snippet')
export class ApiViewerDemoSnippet extends LitElement {
  @property({ type: String }) tag = '';

  @property({ attribute: false, hasChanged: () => true })
  knobs: KnobValues = {};

  @property({ attribute: false, hasChanged: () => true })
  slots: SlotInfo[] = EMPTY_SLOT_INFO;

  static get styles() {
    return [
      prismTheme,
      css`
        :host {
          display: block;
          padding: 1.5rem;
          background: #fafafa;
          border-top: solid 1px var(--ave-border-color);
          border-bottom: solid 1px var(--ave-border-color);
        }

        pre {
          margin: 0;
        }
      `
    ];
  }

  protected render() {
    return html`
      ${renderSnippet(this.tag, this.knobs, this.slots)}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'api-viewer-demo-snippet': ApiViewerDemoSnippet;
  }
}
