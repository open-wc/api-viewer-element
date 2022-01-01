import { CssCustomProperty, ClassField } from '@api-viewer/common/lib/index.js';

export type CssCustomPropertyValue = CssCustomProperty & { value?: string };

export interface SlotValue {
  name: string;
  content: string;
}

export type KnobValue = string | number | boolean | null | undefined;

export type ComponentWithProps = {
  [key: string]: KnobValue;
};

export type Knobable = unknown | (CssCustomProperty | ClassField | SlotValue);

export type Knob<T extends Knobable = unknown> = T & {
  attribute: string | undefined;
  value: KnobValue;
  custom?: boolean;
  options?: string[];
  knobType: string;
  content?: string;
};

export type PropertyKnob = Knob<ClassField>;

export interface HasKnobs {
  getKnob(name: string): { knob: PropertyKnob; custom?: boolean };
  syncKnob(component: Element, changed: PropertyKnob): void;
}
