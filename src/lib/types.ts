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
  type: string | undefined;
  attribute: string | undefined;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface EventInfo extends Info {}
