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
    manifest.modules.some(
      (x) =>
        x.exports?.some((y) => y.kind === 'custom-element-definition') ||
        x.declarations?.some((z) => (z as CustomElement).customElement)
    )
  );
}

const isCustomElementExport = (y: Export): y is CustomElementExport =>
  y.kind === 'custom-element-definition';

const isCustomElementDeclaration = (y: ClassLike): y is CustomElement =>
  (y as CustomElement).customElement;

const isPublicProperty = (x: ClassMember): x is ClassField =>
  x.kind === 'field' && !(x.privacy === 'private' || x.privacy === 'protected');

export async function fetchManifest(src: string): Promise<Package | null> {
  try {
    const file = await fetch(src);
    const manifest: Package = await file.json();
    if (hasCustomElements(manifest)) {
      return manifest;
    }
    throw new Error(`No element definitions found at ${src}`);
  } catch (e) {
    console.error(e);
    return null;
  }
}

export function getCustomElements(manifest: Package): CustomElementExport[] {
  return (manifest.modules ?? []).flatMap(
    (x) => x.exports?.filter(isCustomElementExport) ?? []
  );
}

export const getElementData = (
  manifest: Package,
  selected?: string
): CustomElement | null => {
  const exports = getCustomElements(manifest);
  const index = selected ? exports.findIndex((el) => el?.name === selected) : 0;

  const element = exports[index];

  if (!element) {
    return null;
  }

  const decl = !element.declaration.module
    ? manifest.modules
        .flatMap((x) => x.declarations)
        .find(
          (y): y is CustomElementDeclaration =>
            y?.name === element.declaration.name
        )
    : manifest.modules
        .find((m) => m.path === element.declaration.module.replace(/^\//, ''))
        ?.declarations?.find((d) => d.name === element.declaration.name);

  if (!decl || !isCustomElementDeclaration(decl)) {
    throw new Error(`Could not find declaration for ${selected}`);
  }

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

export const getPublicFields = (members: ClassMember[] = []): ClassField[] => {
  return members.filter(isPublicProperty);
};
