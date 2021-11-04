import type { Package } from 'custom-elements-manifest/schema';

import { LitElement, html } from 'lit';
import { property } from 'lit/decorators/property.js';
import { hasCustomElements } from './lib/utils.js';

/* eslint-disable @typescript-eslint/no-explicit-any */
export type Constructor<T = unknown> = new (...args: any[]) => T;

export interface ApiViewerInterface {
  src?: string;

  manifest?: Package;

  selected?: string;

  jsonFetched: Promise<Package | null>;
}

export async function fetchJson(src: string): Promise<Package | null> {
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

export const emptyDataWarning = html`
  <div part="warning">No custom elements found in the JSON file.</div>
`;

export const ApiViewerMixin = <T extends Constructor<LitElement>>(
  base: T
): T & Constructor<ApiViewerInterface> => {
  class ApiViewer extends base {
    @property({ reflect: true }) src?: string;

    @property({ attribute: false }) manifest?: Package;

    @property({ reflect: true }) selected?: string;

    jsonFetched: Promise<Package | null> = Promise.resolve(null);

    private lastSrc?: string;

    willUpdate(): void {
      const { src } = this;

      if (Array.isArray(this.manifest)) {
        this.lastSrc = undefined;
        this.jsonFetched = Promise.resolve(this.manifest);
      } else if (src && this.lastSrc !== src) {
        this.lastSrc = src;
        this.jsonFetched = fetchJson(src);
      }
    }
  }

  return ApiViewer;
};
