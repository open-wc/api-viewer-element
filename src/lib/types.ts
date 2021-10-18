import type * as Manifest from 'custom-elements-manifest/schema';

export type ElementPromise = Promise<Manifest.CustomElement[]>;

export type Prop = Manifest.PropertyLike & { attribute?: string };
export type CSSProp = Manifest.CssCustomProperty & { value?: string };

export interface KnobValue {
  type: string;
  attribute: string | undefined;
  value: string | number | boolean | null;
  custom?: boolean;
}

export type KnobValues = { [name: string]: KnobValue };

export type ComponentWithProps = {
  [s: string]: string | number | boolean | null;
};

/* eslint-disable @typescript-eslint/no-explicit-any */
export type Constructor<T = unknown> = new (...args: any[]) => T;

export interface SlotWithContent extends Manifest.Slot {
  content: string;
}
