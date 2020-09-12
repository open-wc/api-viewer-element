export interface Info {
  name: string;
  description: string;
}

export interface AttributeInfo extends Info {
  type: string | undefined;
}

export interface PropertyInfo extends Info {
  type: string;
  attribute: string | undefined;
  value: string | number | boolean | null | undefined;
  default: string | number | boolean | null | undefined;
  options?: string[];
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface SlotInfo extends Info {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface EventInfo extends Info {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface CSSPartInfo extends Info {}

export interface CSSPropertyInfo extends Info {
  value?: string;
  default?: string;
  type?: string;
}

export interface ElementInfo extends Info {
  attributes: AttributeInfo[];
  events: EventInfo[];
  properties: PropertyInfo[];
  slots: SlotInfo[];
  cssProperties: CSSPropertyInfo[];
  cssParts: CSSPartInfo[];
}

export interface ElementSetInfo {
  tags: ElementInfo[];
}

export type ElementPromise = Promise<ElementInfo[]>;

export interface KnobValue {
  type: string;
  attribute: string | undefined;
  value: string | number | boolean | null;
  custom?: boolean;
}

export type KnobValues = { [name: string]: KnobValue };

export interface SlotValue {
  name: string;
  content: string;
}

export type ComponentWithProps = {
  [s: string]: string | number | boolean | null;
};
