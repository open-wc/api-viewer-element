import { LitElement, html } from 'lit';
import { property } from 'lit/decorators/property.js';
import { fetchManifest, Package } from './lib/manifest.js';

/* eslint-disable @typescript-eslint/no-explicit-any */
export type Constructor<T = unknown> = new (...args: any[]) => T;

export interface ApiViewerInterface {
  src?: string;

  manifest?: Package;

  selected?: string;

  jsonFetched: Promise<Package | null>;
}

export const emptyDataWarning = html`
  <div part="warning">No custom elements found in the JSON file.</div>
`;

export const ApiViewerMixin = <T extends Constructor<LitElement>>(
  base: T
): T & Constructor<ApiViewerInterface> => {
  class ApiViewer extends base {
    @property() src?: string;

    @property({ attribute: false })
    manifest?: Package;

    @property() selected?: string;

    jsonFetched: Promise<Package | null> = Promise.resolve(null);

    private lastSrc?: string;

    willUpdate(): void {
      const { src } = this;

      if (Array.isArray(this.manifest)) {
        this.lastSrc = undefined;
        this.jsonFetched = Promise.resolve(this.manifest);
      } else if (src && this.lastSrc !== src) {
        this.lastSrc = src;
        this.jsonFetched = fetchManifest(src);
      }
    }
  }

  return ApiViewer;
};
