export interface ElementSetInfo {
  tags: ElementInfo[];
}

export interface ElementInfo extends Info {
  attributes: AttributeInfo[] | undefined;
  events: EventInfo[] | undefined;
  properties: PropertyInfo[] | undefined;
  slots: SlotInfo[] | undefined;
  cssProperties: CSSPropertyInfo[] | undefined;
  cssParts: CSSPartInfo[] | undefined;
}

export interface SlotInfo {
  name: string;
  description?: string;
  content?: string;
}

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
}

export interface KnobValue {
  type: string;
  value: string | number | boolean | null;
}

export type KnobValues = { [name: string]: KnobValue };

export interface SlotValue {
  name: string;
  content: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface EventInfo extends Info {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface CSSPartInfo extends Info {}

export interface CSSPropertyInfo extends Info {
  value?: string;
  defaultValue?: string;
}

export type ComponentWithProps = {
  [s: string]: string | number | boolean | null;
};
