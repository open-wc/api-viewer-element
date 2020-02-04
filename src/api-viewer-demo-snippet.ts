import {
  LitElement,
  html,
  customElement,
  css,
  property,
  TemplateResult
} from 'lit-element';
import { unsafeHTML } from 'lit-html/directives/unsafe-html.js';
import { htmlRender } from 'highlight-ts/es/render/html';
import { registerLanguages } from 'highlight-ts/es/languages';
import { XML } from 'highlight-ts/es/languages/xml';
import { init, process } from 'highlight-ts/es/process';
import {
  CSSPropertyInfo,
  KnobValues,
  KnobValue,
  SlotValue
} from './lib/types.js';
import { CSS } from './lib/highlight-css.js';
import { getSlotTemplate, normalizeType } from './lib/utils.js';
import highlightTheme from './lib/highlight-theme.js';

// register languages
registerLanguages(CSS, XML);

// initialize highlighter
const highlighter = init(htmlRender, {
  classPrefix: ''
});

const INDENT = '  ';

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
  Object.keys(values)
    .sort((a, b) => (a > b ? 1 : -1))
    .forEach((key: string) => {
      const knob: KnobValue = values[key];
      const attr = knob.attribute || key;
      switch (normalizeType(knob.type)) {
        case 'boolean':
          markup += knob.value ? ` ${attr}` : '';
          break;
        default:
          markup += knob.value != null ? ` ${attr}="${knob.value}"` : '';
          break;
      }
    });

  markup += `>`;

  const template = getSlotTemplate(tag);
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

  const { value } = process(highlighter, markup, ['xml', 'css']);

  return html`
    <pre><code>${unsafeHTML(value)}</code></pre>
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

  static get styles() {
    return [
      highlightTheme,
      css`
        :host {
          display: block;
          padding: 0.75rem 1rem;
        }
      `
    ];
  }

  protected render() {
    return html`
      ${renderSnippet(this.tag, this.knobs, this.slots, this.cssProps)}
    `;
  }

  get source() {
    return this.renderRoot.querySelector('code');
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'api-viewer-demo-snippet': ApiViewerDemoSnippet;
  }
}
