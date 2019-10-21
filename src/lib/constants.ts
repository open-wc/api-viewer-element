import {
  ElementInfo,
  SlotInfo,
  EventInfo,
  PropertyInfo,
  AttributeInfo,
  Info
} from './types.js';

export const EMPTY_ELEMENTS: ElementInfo[] = [];

export const EMPTY_SLOT_INFO: SlotInfo[] = [];

export const EMPTY_ATTR_INFO: AttributeInfo[] = [];

export const EMPTY_PROP_INFO: PropertyInfo[] = [];

export const EMPTY_EVT_INFO: EventInfo[] = [];

export const EMPTY_ELEMENT: ElementInfo = {
  name: '',
  description: '',
  slots: EMPTY_SLOT_INFO,
  attributes: EMPTY_ATTR_INFO,
  properties: EMPTY_PROP_INFO,
  events: EMPTY_EVT_INFO
};

export const EMPTY_INFO: Info = {
  name: '',
  description: ''
};
