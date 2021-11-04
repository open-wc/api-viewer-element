import type { CssCustomProperty } from 'custom-elements-manifest/schema';

import { html, TemplateResult } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { htmlRender } from 'highlight-ts/es/render/html';
import { registerLanguages } from 'highlight-ts/es/languages';
import { XML } from 'highlight-ts/es/languages/xml';
import { init, process } from 'highlight-ts/es/process';
import { KnobValues, SlotValue } from './types.js';
import { CSS } from './highlight-css.js';
import {
  getTemplate,
  getTemplateNode,
  isTemplate,
  normalizeType,
  TemplateTypes
} from './utils.js';

// register languages
registerLanguages(CSS, XML);

// initialize highlighter
const highlighter = init(htmlRender, {
  classPrefix: ''
});

const { PREFIX, SLOT, SUFFIX, WRAPPER } = TemplateTypes;

const INDENT = '  ';

const unindent = (text: string, prepend: string) => {
  if (!text) return text;
  const lines = text.replace(/\t/g, INDENT).split('\n');
  const indent = lines.reduce((prev: number | null, line: string) => {
    if (/^\s*$/.test(line)) return prev; // Completely ignore blank lines.

    const match = line.match(/^(\s*)/);
    const lineIndent = match && match[0].length;
    if (prev === null) return lineIndent;
    return (lineIndent as number) < prev ? lineIndent : prev;
  }, null);

  return lines.map((l) => prepend + l.substr(indent as number)).join('\n');
};

const getTplContent = (
  template: HTMLTemplateElement,
  prepend: string
): string => {
  const tpl = template.innerHTML.replace(/\s+$/, '').replace(/(="")/g, '');
  return unindent(tpl, prepend);
};

export const renderSnippet = (
  id: number,
  tag: string,
  values: KnobValues,
  slots: SlotValue[],
  cssProps: (CssCustomProperty & { value?: string })[]
): TemplateResult => {
  let markup = '';
  const prefix = getTemplate(id, tag, PREFIX);
  if (isTemplate(prefix)) {
    markup += `${getTplContent(prefix, '').trim()}\n`;
  }

  let prepend = '';
  let wrap = null;

  const wrapper = getTemplate(id, tag, WRAPPER);
  const wrapNode = getTemplateNode(wrapper);
  if (wrapNode) {
    prepend = INDENT;
    const match = wrapNode.outerHTML.match(/<([a-z]+)[^>]*>/);
    if (match) {
      wrap = wrapNode.tagName.toLowerCase();
      markup += `${match[0]}\n${INDENT}`;
    }
  }

  markup += `<${tag}`;
  Object.keys(values)
    .sort((a, b) => (a > b ? 1 : -1))
    .forEach((key: string) => {
      const { value, type, attribute } = values[key];
      const attr = attribute || key;
      switch (normalizeType(type)) {
        case 'boolean':
          markup += value ? ` ${attr}` : '';
          break;
        case 'select':
          markup += value !== '' ? ` ${attr}="${value}"` : '';
          break;
        default:
          markup += value != null ? ` ${attr}="${value}"` : '';
          break;
      }
    });

  markup += `>`;

  const template = getTemplate(id, tag, SLOT);
  if (isTemplate(template)) {
    markup += `${getTplContent(template, `${prepend}${INDENT}`)}\n${prepend}`;
  } else if (slots.length) {
    if (slots.length === 1 && !slots[0].name) {
      markup += slots[0].content;
    } else {
      markup += slots.reduce((result: string, slot) => {
        const { name, content } = slot;
        const line = name ? `<div slot="${name}">${content}</div>` : content;
        return `${result}\n${prepend}${INDENT}${line}`;
      }, '');
      markup += `\n${prepend}`;
    }
  }

  markup += `</${tag}>`;

  if (wrap) {
    markup += `\n</${wrap}>`;
  }

  const suffix = getTemplate(id, tag, SUFFIX);
  if (isTemplate(suffix)) {
    markup += `\n${getTplContent(suffix, '').trim()}\n`;
  }

  const cssValues = cssProps.filter((p) => p.value !== p.default);
  if (cssValues.length) {
    markup += `\n<style>\n${INDENT}${tag} {\n`;
    cssValues.forEach((prop) => {
      if (prop.value) {
        markup += `${INDENT}${INDENT}${prop.name}: ${prop.value};\n`;
      }
    });
    markup += `${INDENT}}\n</style>`;
  }

  const { value } = process(highlighter, markup, ['xml', 'css']);

  return html`<pre><code>${unsafeHTML(value)}</code></pre>`;
};
