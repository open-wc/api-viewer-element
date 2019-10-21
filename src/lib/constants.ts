import {
  ElementInfo,
  SlotInfo,
  EventInfo,
  PropertyInfo,
  AttributeInfo,
  Info
} from './types.js';

export const EMPTY_ELEMENTS: ElementInfo[] = [];

const EMPTY_SLOT_INFO: SlotInfo[] = [];

const EMPTY_ATTR_INFO: AttributeInfo[] = [];

const EMPTY_PROP_INFO: PropertyInfo[] = [];

const EMPTY_EVT_INFO: EventInfo[] = [];

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
