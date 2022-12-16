import { html, type LitElement } from 'lit';
import { property } from 'lit/decorators/property.js';
import { fetchManifest, hasCustomElements, type Package } from './manifest.js';

/* eslint-disable @typescript-eslint/no-explicit-any */
export type Constructor<T = unknown> = new (...args: any[]) => T;

export interface ManifestMixinInterface {
  src?: string;

  manifest?: Package;

  only?: string[];

  selected?: string;

  jsonFetched: Promise<Package | null>;
}

export const emptyDataWarning = html`
  <div part="warning">No custom elements found in the JSON file.</div>
`;

export const ManifestMixin = <T extends Constructor<LitElement>>(
  base: T
): T & Constructor<ManifestMixinInterface> => {
  class ManifestClass extends base {
    @property() src?: string;

    @property({ attribute: false })
    manifest?: Package;

    @property({
      reflect: true,
      converter: {
        fromAttribute: (value: string) => value.split(','),
        toAttribute: (value: string[]) => value.join(',')
      }
    })
    only?: string[];

    @property() selected?: string;

    jsonFetched: Promise<Package | null> = Promise.resolve(null);

    private lastSrc?: string;

    willUpdate(): void {
      const { src } = this;

      if (this.manifest) {
        if (hasCustomElements(this.manifest)) {
          this.lastSrc = undefined;
          this.jsonFetched = Promise.resolve(this.manifest);
        } else {
          console.error('No custom elements found in the `manifest` object.');
        }
      } else if (src && this.lastSrc !== src) {
        this.lastSrc = src;
        this.jsonFetched = fetchManifest(src);
      }
    }
  }

  return ManifestClass;
};
