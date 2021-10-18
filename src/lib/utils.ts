import type * as Manifest from 'custom-elements-manifest/schema';
import { Prop } from './types';

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

export const getTemplateNode = (node: unknown) =>
  isTemplate(node) && node.content.firstElementChild;

export const getTemplate = (id: number, name: string, type: string) =>
  templates[id].find(matchTemplate(name, type));

export const getTemplates = (id: number, name: string, type: string) =>
  templates[id].filter(matchTemplate(name, type));

export const hasTemplate = (id: number, name: string, type: string) =>
  templates[id].some(matchTemplate(name, type));

export const isPropMatch = (name: string) => (prop: Prop) =>
  prop.attribute === name || prop.name === name;

export const normalizeType = (
  type: Manifest.Type | string | undefined = ''
) => {
  const t = typeof type === 'string' ? type : type.text;
  return t.replace(' | undefined', '').replace(' | null', '');
};

export const unquote = (value?: string) =>
  typeof value === 'string' && value.startsWith('"') && value.endsWith('"')
    ? value.slice(1, value.length - 1)
    : value;

const isClassDeclaration = (x: Manifest.Declaration) => x.kind === 'class';
const isCustomElement = (
  x: Manifest.Declaration
): x is Manifest.CustomElementDeclaration =>
  isClassDeclaration(x) &&
  (x as unknown as Manifest.CustomElement).customElement;

export async function getElements(
  jsonFetched: Promise<Manifest.Package | null>
): Promise<Manifest.CustomElement[]> {
  const modules = await jsonFetched.then((x) => x?.modules ?? []);
  const declarations = modules.flatMap((m) => m.declarations ?? []);
  return declarations.filter(
    isCustomElement
  ) as unknown as Manifest.CustomElement[];
}
