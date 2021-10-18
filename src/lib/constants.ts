import type * as Manifest from 'custom-elements-manifest/schema';

export const EMPTY_ELEMENT: Manifest.CustomElement = {
  customElement: true,
  name: '',
  description: '',
  slots: [],
  attributes: [],
  members: [],
  events: [],
  cssParts: [],
  cssProperties: []
};
