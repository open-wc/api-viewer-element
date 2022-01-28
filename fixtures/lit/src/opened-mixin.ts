import { LitElement } from 'lit';
import { property } from 'lit/decorators/property.js';

/* eslint-disable @typescript-eslint/no-explicit-any */
export type Constructor<T = unknown> = new (...args: any[]) => T;

export interface OpenedMixinInterface {
  opened: boolean | null | undefined;

  toggle(): void;
}

export const OpenedMixin = <T extends Constructor<LitElement>>(
  base: T
): T & Constructor<OpenedMixinInterface> => {
  class OpenedMixinClass extends base {
    /**
     * When true, the content is visible.
     */
    @property({ type: Boolean, reflect: true })
    opened: boolean | null | undefined = false;

    /**
     * Toggle the opened property value.
     */
    toggle() {
      this.opened = !this.opened;
    }
  }

  return OpenedMixinClass;
};
