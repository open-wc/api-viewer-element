import type {
  Attribute,
  ClassField,
  ClassLike,
  ClassMember,
  CssCustomProperty,
  CssPart,
  CustomElement,
  CustomElementDeclaration,
  CustomElementExport,
  Event,
  Export,
  Package,
  Slot
} from 'custom-elements-manifest/schema';

export {
  Attribute,
  ClassField,
  ClassMember,
  CssCustomProperty,
  CssPart,
  CustomElement,
  Event,
  Package,
  Slot
};

export type CssCustomPropertyValue = CssCustomProperty & { value?: string };

export interface SlotValue {
  name: string;
  content: string;
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

export const isClassField = (x: ClassMember): x is ClassField =>
  x.kind === 'field';

export const isCustomElementExport = (y: Export): y is CustomElementExport =>
  y.kind === 'custom-element-definition';

export const isCustomElementDeclaration = (y: ClassLike): y is CustomElement =>
  (y as CustomElement).customElement;

export const isPrivateOrProtected = (x: ClassField): boolean =>
  x.privacy === 'private' || x.privacy === 'protected';

export const isPublicProperty = (x: ClassMember): x is ClassField =>
  isClassField(x) && !isPrivateOrProtected(x);

export function getCustomElements(
  manifest?: Package | null
): CustomElementExport[] {
  return (manifest?.modules ?? []).flatMap(
    (x) => x.exports?.filter(isCustomElementExport) ?? []
  );
}

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
