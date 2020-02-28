import {
  LitElement,
  html,
  customElement,
  property,
  PropertyValues
} from 'lit-element';
import { nothing, TemplateResult } from 'lit-html';
import {
  PropertyInfo,
  SlotInfo,
  AttributeInfo,
  EventInfo,
  CSSPartInfo,
  CSSPropertyInfo
} from './lib/types.js';
import { isEmptyArray, isPropMatch, unquote } from './lib/utils.js';
import { parse } from './lib/markdown.js';

import './api-viewer-panel.js';
import './api-viewer-tab.js';

/* eslint-disable import/no-duplicates */
import './api-viewer-tabs.js';
import { ApiViewerTabs } from './api-viewer-tabs.js';
/* eslint-enable import/no-duplicates */

const renderItem = (
  prefix: string,
  name: string,
  description: string,
  valueType?: string,
  value?: unknown,
  attribute?: string
): TemplateResult => {
  return html`
    <div part="docs-item">
      <div part="docs-row">
        <div part="docs-column" class="column-name-${prefix}">
          <div part="docs-label">Name</div>
          <div part="docs-value" class="accent">${name}</div>
        </div>
        ${attribute === undefined
          ? nothing
          : html`
              <div part="docs-column">
                <div part="docs-label">Attribute</div>
                <div part="docs-value">${attribute}</div>
              </div>
            `}
        ${valueType === undefined && value === undefined
          ? nothing
          : html`
              <div part="docs-column" class="column-type">
                <div part="docs-label">Type</div>
                <div part="docs-value">
                  ${valueType ||
                    (Number.isNaN(Number(value)) ? typeof value : 'number')}
                  ${value === undefined
                    ? nothing
                    : html`
                        = <span class="accent">${value}</span>
                      `}
                </div>
              </div>
            `}
      </div>
      <div ?hidden="${description === undefined}">
        <div part="docs-label">Description</div>
        <div part="docs-markdown">${parse(description)}</div>
      </div>
    </div>
  `;
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
      part="tab"
      ?hidden="${hidden}"
    ></api-viewer-tab>
    <api-viewer-panel slot="panel" part="tab-panel" ?hidden="${hidden}">
      ${content}
    </api-viewer-panel>
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

  protected createRenderRoot() {
    return this;
  }

  protected render() {
    const { slots, props, attrs, events, cssParts, cssProps } = this;

    const properties = props || [];
    const attributes = (attrs || []).filter(
      ({ name }) => !properties.some(isPropMatch(name))
    );

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
          <div part="warning">
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
                ${properties.map(prop => {
                  const { name, description, type, attribute } = prop;
                  return renderItem(
                    'prop',
                    name,
                    description,
                    type,
                    prop.default,
                    attribute
                  );
                })}
              `
            )}
            ${renderTab(
              'Attributes',
              attributes.length,
              html`
                ${attributes.map(({ name, description, type }) =>
                  renderItem('attr', name, description, type)
                )}
              `
            )}
            ${renderTab(
              'Slots',
              slots.length,
              html`
                ${slots.map(({ name, description }) =>
                  renderItem('slot', name, description)
                )}
              `
            )}
            ${renderTab(
              'Events',
              events.length,
              html`
                ${events.map(({ name, description }) =>
                  renderItem('event', name, description)
                )}
              `
            )}
            ${renderTab(
              'CSS Custom Properties',
              cssProps.length,
              html`
                ${cssProps.map(prop => {
                  const { name, description, type } = prop;
                  return renderItem(
                    'css',
                    name,
                    description,
                    type,
                    unquote(prop.default)
                  );
                })}
              `
            )}
            ${renderTab(
              'CSS Shadow Parts',
              cssParts.length,
              html`
                ${cssParts.map(({ name, description }) =>
                  renderItem('part', name, description)
                )}
              `
            )}
          </api-viewer-tabs>
        `;
  }

  protected updated(props: PropertyValues) {
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
