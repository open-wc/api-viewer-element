import type { CustomElement, Package } from 'custom-elements-manifest/schema';
import type { PropertyValues } from 'lit';

import { LitElement, html } from 'lit';
import { property } from 'lit/decorators.js';
import { Constructor } from './lib/types.js';

export interface ApiViewerInterface {
  src?: string;

  elements?: CustomElement[];

  package?: Package | null;

  selected?: string;

  jsonFetched?: Promise<Package | null>;
}

function hasCustomElements(pkg?: Package): boolean {
  return !!pkg?.modules?.some?.((x) =>
    x.exports?.some?.((y) => y.kind === 'custom-element-definition')
  );
}

export async function fetchJson(src: string): Promise<Package | null> {
  try {
    const file = await fetch(src);
    const json = (await file.json()) as Package;
    if (!hasCustomElements(json)) {
      throw new Error(`No element definitions found at ${src}`);
    } else {
      return json;
    }
  } catch (e) {
    console.error(e);
    return null;
  }
}

export const emptyDataWarning = html`
  <div part="warning">No custom elements found in the manifest.</div>
`;

export const ApiViewerMixin = <T extends Constructor<LitElement>>(
  base: T
): T & Constructor<ApiViewerInterface> => {
  class ApiViewer extends base {
    @property() src?: string;

    @property({ attribute: false })
    package?: Package;

    @property({ attribute: false })
    elements?: CustomElement[];

    @property() selected?: string;

    jsonFetched?: Promise<Package | null> = Promise.resolve(null);

    private lastSrc?: string;

    protected update(props: PropertyValues) {
      const { src } = this;

      if (hasCustomElements(this.package)) {
        this.lastSrc = undefined;
        this.jsonFetched = Promise.resolve(this.package ?? null);
      } else if (src && this.lastSrc !== src) {
        this.lastSrc = src;
        this.jsonFetched = fetchJson(src);
      }

      super.update(props);
    }
  }

  return ApiViewer;
};
