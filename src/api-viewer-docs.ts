import {
  LitElement,
  html,
  customElement,
  css,
  property,
  PropertyValues
} from 'lit-element';
import { TemplateResult } from 'lit-html';
import {
  PropertyInfo,
  SlotInfo,
  AttributeInfo,
  EventInfo
} from './lib/types.js';

import './api-viewer-item.js';
import './api-viewer-panel.js';
import './api-viewer-tab.js';

/* eslint-disable import/no-duplicates */
import './api-viewer-tabs.js';
import { ApiViewerTabs } from './api-viewer-tabs.js';
/* eslint-enable import/no-duplicates */

const processAttrs = (
  attrs: AttributeInfo[],
  props: PropertyInfo[]
): AttributeInfo[] => {
  return attrs.filter(attr => !props.some(prop => prop.name === attr.name));
};

const processProps = (
  props: PropertyInfo[],
  attrs: AttributeInfo[]
): PropertyInfo[] => {
  return props.map((prop: PropertyInfo) => {
    const p = prop;
    const a = attrs.find(attr => prop.name === attr.name);
    if (a) {
      p.attribute = a.name;
    }
    return p;
  });
};

const renderTab = (
  heading: string,
  hidden: boolean,
  content: TemplateResult
): TemplateResult => {
  return html`
    <api-viewer-tab
      heading="${heading}"
      slot="tab"
      ?hidden="${hidden}"
    ></api-viewer-tab>
    <api-viewer-panel slot="panel" ?hidden="${hidden}">
      ${content}
    </api-viewer-panel>
  `;
};

const renderProperties = (props: PropertyInfo[]): TemplateResult => {
  return renderTab(
    'Properties',
    props.length === 0,
    html`
      ${props.map(
        prop => html`
          <api-viewer-item
            .name="${prop.name}"
            .description="${prop.description}"
            .valueType="${prop.type}"
            .attribute="${prop.attribute}"
          ></api-viewer-item>
        `
      )}
    `
  );
};

const renderAttributes = (attrs: AttributeInfo[]): TemplateResult => {
  return renderTab(
    'Attributes',
    attrs.length === 0,
    html`
      ${attrs.map(
        attr => html`
          <api-viewer-item
            .name="${attr.name}"
            .description="${attr.description}"
            .valueType="${attr.type}"
          ></api-viewer-item>
        `
      )}
    `
  );
};

const renderSlots = (slots: SlotInfo[]): TemplateResult => {
  return renderTab(
    'Slots',
    slots.length === 0,
    html`
      ${slots.map(
        slot => html`
          <api-viewer-item
            .name="${slot.name}"
            .description="${slot.description}"
          ></api-viewer-item>
        `
      )}
    `
  );
};

const renderEvents = (events: EventInfo[]): TemplateResult => {
  return renderTab(
    'Events',
    events.length === 0,
    html`
      ${events.map(
        event => html`
          <api-viewer-item
            .name="${event.name}"
            .description="${event.description}"
          ></api-viewer-item>
        `
      )}
    `
  );
};

@customElement('api-viewer-docs')
export class ApiViewerDocs extends LitElement {
  @property({ type: String }) name = '';

  @property({ attribute: false, hasChanged: () => true })
  props: PropertyInfo[] = [];

  @property({ attribute: false, hasChanged: () => true })
  attrs: AttributeInfo[] = [];

  @property({ attribute: false, hasChanged: () => true })
  slots: SlotInfo[] = [];

  @property({ attribute: false, hasChanged: () => true })
  events: EventInfo[] = [];

  static get styles() {
    return css`
      :host {
        display: block;
      }

      api-viewer-item:not(:first-of-type) {
        border-top: solid 1px var(--ave-border-color);
      }
    `;
  }

  protected render() {
    const { slots, props, attrs, events } = this;

    const attributes = processAttrs(attrs || [], props || []);
    const properties = processProps(props || [], attrs || []);

    return html`
      <api-viewer-tabs>
        ${renderProperties(properties)}${renderAttributes(attributes)}
        ${renderSlots(slots)}${renderEvents(events)}
      </api-viewer-tabs>
    `;
  }

  protected updated(props: PropertyValues) {
    super.updated(props);

    if (props.has('name') && props.get('name')) {
      const tabs = this.renderRoot.querySelector(
        'api-viewer-tabs'
      ) as ApiViewerTabs;
      tabs.selectFirst();
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'api-viewer-docs': ApiViewerDocs;
  }
}
