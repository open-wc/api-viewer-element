import { Knob } from './knobs.js';
import { ElementInfo, PropertyInfo } from './types';

const templates: Array<HTMLTemplateElement[]> = [];

export const setTemplates = (id: number, tpl: HTMLTemplateElement[]) => {
  templates[id] = tpl;
};

export const TemplateTypes = Object.freeze({
  HOST: 'host',
  KNOB: 'knob',
  SLOT: 'slot',
  PREFIX: 'prefix',
  SUFFIX: 'suffix',
  WRAPPER: 'wrapper'
});

export const isTemplate = (node: unknown): node is HTMLTemplateElement =>
  node instanceof HTMLTemplateElement;

const matchTemplate =
  (name: string, type: string) => (tpl: HTMLTemplateElement) => {
    const { element, target } = tpl.dataset;
    return element === name && target === type;
  };

export const getTemplateNode = (node: unknown): Element | null =>
  isTemplate(node) ? node.content.firstElementChild : null;

export const getTemplate = (
  id: number,
  name: string,
  type: string
): HTMLTemplateElement | undefined =>
  templates[id].find(matchTemplate(name, type));

export const getTemplates = (
  id: number,
  name: string,
  type: string
): HTMLTemplateElement[] => templates[id].filter(matchTemplate(name, type));

export const hasTemplate = (id: number, name: string, type: string): boolean =>
  templates[id].some(matchTemplate(name, type));

export const isPropMatch =
  (name: string) =>
  (prop: PropertyInfo | Knob<PropertyInfo>): boolean =>
    prop.attribute === name || prop.name === name;

export const normalizeType = (type: string | undefined = ''): string =>
  type.replace(' | undefined', '').replace(' | null', '');

export const unquote = (value?: string): string | undefined =>
  typeof value === 'string' && value.startsWith('"') && value.endsWith('"')
    ? value.slice(1, value.length - 1)
    : value;

const EMPTY_ELEMENT: ElementInfo = {
  name: '',
  description: '',
  slots: [],
  attributes: [],
  properties: [],
  events: [],
  cssParts: [],
  cssProperties: []
};

export const getElementData = (elements: ElementInfo[], selected?: string) => {
  const index = selected ? elements.findIndex((el) => el.name === selected) : 0;

  const result = { ...EMPTY_ELEMENT, ...elements[index] };

  // TODO: analyzer should sort CSS custom properties
  result.cssProperties = result.cssProperties.sort((a, b) =>
    a.name > b.name ? 1 : -1
  );

  return result;
};
