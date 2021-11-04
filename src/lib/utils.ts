import type {
  ClassField,
  ClassLike,
  ClassMember,
  CustomElement,
  CustomElementDeclaration,
  CustomElementExport,
  Export,
  Package
} from 'custom-elements-manifest/schema';

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

export const isCustomElementExport = (y: Export): y is CustomElementExport =>
  y.kind === 'custom-element-definition';
export const isCustomElementDeclaration = (y: ClassLike): y is CustomElement =>
  (y as CustomElement).customElement;

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

export const isClassField = (x: ClassMember): x is ClassField =>
  x.kind === 'field';

export const isPropMatch =
  (name: string) =>
  (prop: ClassField): boolean =>
    // prop.attribute === name ||
    prop.name === name;

export const normalizeType = (type: string | undefined = ''): string =>
  type.replace(' | undefined', '').replace(' | null', '');

export const unquote = (value?: string): string | undefined =>
  typeof value === 'string' && value.startsWith('"') && value.endsWith('"')
    ? value.slice(1, value.length - 1)
    : value;

export const getElementData = (
  manifest: Package,
  selected?: string
): CustomElement | null => {
  const exports = manifest.modules.flatMap((m) =>
    m.exports?.filter(isCustomElementExport)
  );
  const index = selected ? exports.findIndex((el) => el?.name === selected) : 0;

  const element = exports[index];

  if (!element) return null;

  const decl = !element.declaration.module
    ? manifest.modules
        .flatMap((x) => x.declarations)
        .find(
          (y): y is CustomElementDeclaration =>
            y?.name === element.declaration.name
        )
    : manifest.modules
        .find((m) => m.path === element.declaration.module)
        ?.declarations?.find((d) => d.name === element.declaration.name);

  if (!decl || !isCustomElementDeclaration(decl))
    throw new Error(`Could not find declaration for ${selected}`);

  return {
    customElement: true,
    name: element.name,
    description: decl?.description,
    slots: decl.slots ?? [],
    attributes: decl.attributes ?? [],
    members: decl.members ?? [],
    events: decl.events ?? [],
    cssParts: decl.cssParts ?? [],
    // TODO: analyzer should sort CSS custom properties
    cssProperties: [...(decl.cssProperties ?? [])].sort((a, b) =>
      a.name > b.name ? 1 : -1
    )
  };
};

export function getCustomElements(
  manifest?: Package | null
): CustomElementExport[] {
  return (manifest?.modules ?? []).flatMap(
    (x) => x.exports?.filter(isCustomElementExport) ?? []
  );
}

export function hasCustomElements(
  manifest?: Package | null
): manifest is Package {
  return (
    !!manifest &&
    Array.isArray(manifest.modules) &&
    !!manifest.modules.length &&
    manifest.modules.some(
      (x) =>
        x.exports?.some((y) => y.kind === 'custom-element-definition') ||
        x.declarations?.some((z) => (z as CustomElement).customElement)
    )
  );
}
