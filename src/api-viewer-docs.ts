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
  EventInfo,
  CSSPartInfo,
  CSSPropertyInfo
} from './lib/types.js';
import { isEmptyArray } from './lib/utils.js';

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

const renderTab = (
  heading: string,
  count: number,
  content: TemplateResult
): TemplateResult => {
  const hidden = count === 0;
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

const renderEntity = (
  items: Array<SlotInfo | EventInfo | CSSPartInfo | CSSPropertyInfo>
): TemplateResult => {
  return html`
    ${items.map(
      (item: SlotInfo | EventInfo | CSSPartInfo | CSSPropertyInfo) => html`
        <api-viewer-item
          .name="${item.name}"
          .description="${item.description}"
        ></api-viewer-item>
      `
    )}
  `;
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

  @property({ attribute: false, hasChanged: () => true })
  cssParts: CSSPartInfo[] = [];

  @property({ attribute: false, hasChanged: () => true })
  cssProps: CSSPropertyInfo[] = [];

  static get styles() {
    return css`
      :host {
        display: block;
      }

      api-viewer-item:not(:first-of-type) {
        border-top: solid 1px var(--ave-border-color);
      }

      api-viewer-tab {
        max-width: 150px;
      }

      api-viewer-tab[heading^='CSS'] {
        font-size: 0.8125rem;
      }

      .warn {
        padding: 1rem;
      }
    `;
  }

  protected render() {
    const { slots, props, attrs, events, cssParts, cssProps } = this;

    const properties = props || [];
    const attributes = processAttrs(attrs || [], properties);

    const emptyDocs = [
      properties,
      attributes,
      slots,
      events,
      cssProps,
      cssParts
    ].every(isEmptyArray);

    return emptyDocs
      ? html`
          <div class="warn">
            The element &lt;${this.name}&gt; does not provide any documented
            API.
          </div>
        `
      : html`
          <api-viewer-tabs>
            ${renderTab(
              'Properties',
              properties.length,
              html`
                ${properties.map(
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
            )}
            ${renderTab(
              'Attributes',
              attributes.length,
              html`
                ${attributes.map(
                  attr => html`
                    <api-viewer-item
                      .name="${attr.name}"
                      .description="${attr.description}"
                      .valueType="${attr.type}"
                    ></api-viewer-item>
                  `
                )}
              `
            )}
            ${renderTab('Slots', slots.length, renderEntity(slots))}
            ${renderTab('Events', events.length, renderEntity(events))}
            ${renderTab(
              'CSS Custom Properties',
              cssProps.length,
              renderEntity(cssProps)
            )}
            ${renderTab(
              'CSS Shadow Parts',
              cssParts.length,
              renderEntity(cssParts)
            )}
          </api-viewer-tabs>
        `;
  }

  protected updated(props: PropertyValues) {
    super.updated(props);

    if (props.has('name') && props.get('name')) {
      const tabs = this.renderRoot.querySelector('api-viewer-tabs');
      if (tabs instanceof ApiViewerTabs) {
        tabs.selectFirst();
      }
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'api-viewer-docs': ApiViewerDocs;
  }
}
