export interface ElementSetInfo {
  tags: ElementInfo[];
}

export interface ElementInfo extends Info {
  attributes: AttributeInfo[] | undefined;
  events: EventInfo[] | undefined;
  properties: PropertyInfo[] | undefined;
  slots: SlotInfo[] | undefined;
}

export interface SlotInfo {
  name: string;
  description: string;
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

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface EventInfo extends Info {}

export type ComponentWithProps = {
  [s: string]: string | number | boolean | null;
};
