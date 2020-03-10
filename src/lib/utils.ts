import { PropertyInfo } from './types';

const getSlotDefault = (name: string, initial: string) => {
  return name === '' ? initial : name[0].toUpperCase() + name.slice(1);
};

export const getSlotContent = (name: string) => getSlotDefault(name, 'Content');

export const getSlotTitle = (name: string) => getSlotDefault(name, 'Default');

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

const matchTemplate = (name: string, type: string) => (
  tpl: HTMLTemplateElement
) => {
  const { element, target } = tpl.dataset;
  return element === name && target === type;
};

export const getTemplateNode = (node: unknown) =>
  isTemplate(node) && node.content.firstElementChild;

export const getTemplate = (id: number, name: string, type: string) =>
  templates[id].find(matchTemplate(name, type));

export const getTemplates = (id: number, name: string, type: string) =>
  templates[id].filter(matchTemplate(name, type));

export const hasTemplate = (id: number, name: string, type: string) =>
  templates[id].some(matchTemplate(name, type));

export const isEmptyArray = (array: unknown[]) => array.length === 0;

export const isPropMatch = (name: string) => (prop: PropertyInfo) =>
  prop.attribute === name || prop.name === name;

export const normalizeType = (type: string | undefined = '') =>
  type.replace(' | undefined', '').replace(' | null', '');

export const unquote = (value?: string) =>
  typeof value === 'string' && value.startsWith('"') && value.endsWith('"')
    ? value.slice(1, value.length - 1)
    : value;
