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
import {
  CSSPropertyInfo,
  KnobValues,
  KnobValue,
  SlotValue
} from './lib/types.js';
import { getTemplate } from './lib/utils.js';
import buttonStyle from './lib/button-style.js';
import prismTheme from './lib/prism-theme.js';

const { highlight, languages } = window.Prism;

const INDENT = '  ';

declare global {
  interface Window {
    Prism: typeof import('prismjs');
  }
}

const unindent = (text: string) => {
  if (!text) return text;
  const lines = text.replace(/\t/g, INDENT).split('\n');
  const indent = lines.reduce((prev: number | null, line: string) => {
    if (/^\s*$/.test(line)) return prev; // Completely ignore blank lines.

    const match = line.match(/^(\s*)/);
    const lineIndent = match && match[0].length;
    if (prev === null) return lineIndent;
    return (lineIndent as number) < prev ? lineIndent : prev;
  }, null);

  return lines.map(l => INDENT + l.substr(indent as number)).join('\n');
};

const renderSnippet = (
  tag: string,
  values: KnobValues,
  slots: SlotValue[],
  cssProps: CSSPropertyInfo[]
): TemplateResult => {
  let markup = `<${tag}`;
  Object.keys(values).forEach((key: string) => {
    const knob: KnobValue = values[key];
    switch (knob.type) {
      case 'boolean':
        markup += knob.value ? ` ${key}` : '';
        break;
      default:
        // eslint-disable-next-line eqeqeq
        markup += knob.value != undefined ? ` ${key}="${knob.value}"` : '';
        break;
    }
  });

  markup += `>`;

  const template = getTemplate(tag);
  if (template instanceof HTMLTemplateElement) {
    const tpl = template.innerHTML.replace(/\s+$/, '').replace(/(="")/g, '');
    markup += unindent(tpl);
    markup += `\n`;
  } else if (slots.length) {
    slots.forEach(slot => {
      const { name, content } = slot;
      const div = name ? `<div slot="${name}">` : '<div>';
      markup += `\n${INDENT}${div}${content}</div>`;
    });
    markup += `\n`;
  }

  markup += `</${tag}>`;

  const cssValues = cssProps.filter(p => p.value !== p.defaultValue);
  if (cssValues.length) {
    markup += `\n<style>\n${INDENT}${tag} {\n`;
    cssValues.forEach(prop => {
      if (prop.value) {
        markup += `${INDENT}${INDENT}${prop.name}: ${prop.value};\n`;
      }
    });
    markup += `${INDENT}}\n</style>`;
  }

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
  slots: SlotValue[] = [];

  @property({ attribute: false, hasChanged: () => true })
  cssProps: CSSPropertyInfo[] = [];

  @property({ type: String }) protected btnText = 'copy';

  static get styles() {
    return [
      buttonStyle,
      prismTheme,
      css`
        :host {
          display: block;
          position: relative;
          padding: 0.75rem 1rem;
        }

        pre {
          margin: 0;
        }
      `
    ];
  }

  protected render() {
    return html`
      <button @click="${this._onCopyClick}">${this.btnText}</button>
      ${renderSnippet(this.tag, this.knobs, this.slots, this.cssProps)}
    `;
  }

  private _onCopyClick() {
    const range = document.createRange();
    const source = this.renderRoot.querySelector('code');
    if (source) {
      range.selectNodeContents(source);
      const selection = window.getSelection() as Selection;
      selection.removeAllRanges();
      selection.addRange(range);
      try {
        document.execCommand('copy');
        this.btnText = 'done';
      } catch (err) {
        // Copy command is not available
        console.error(err);
        this.btnText = 'error';
      }

      // Return to the copy button after a second.
      setTimeout(() => {
        this.btnText = 'copy';
      }, 1000);

      selection.removeAllRanges();
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'api-viewer-demo-snippet': ApiViewerDemoSnippet;
  }
}
