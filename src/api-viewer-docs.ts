import type * as Manifest from 'custom-elements-manifest/schema';
import type { PropertyValues, TemplateResult } from 'lit';

import { LitElement, html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { isPropMatch, unquote } from './lib/utils.js';
import { parse } from './lib/markdown.js';

import './api-viewer-panel.js';
import './api-viewer-tab.js';
import './api-viewer-tabs.js';

const isClassField = (m: Manifest.ClassMember): m is Manifest.ClassField =>
  m.kind !== 'method';
const isClassMethod = (m: Manifest.ClassMember): m is Manifest.ClassMethod =>
  m.kind === 'method';

const renderItem = (
  prefix: string,
  name: string,
  description: string,
  valueType?: string,
  value?: unknown,
  attribute?: string
): TemplateResult => html`
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
                  : html` = <span class="accent">${value}</span> `}
              </div>
            </div>
          `}
    </div>
    <div ?hidden=${description === undefined}>
      <div part="docs-label">Description</div>
      <div part="docs-markdown">${parse(description)}</div>
    </div>
  </div>
`;

const renderTab = (
  heading: string,
  array: (Manifest.ClassMember | Manifest.Attribute)[],
  content: TemplateResult
): TemplateResult => {
  const hidden = array.length === 0;
  return html`
    <api-viewer-tab
      heading=${heading}
      slot="tab"
      part="tab"
      ?hidden=${hidden}
    ></api-viewer-tab>
    <api-viewer-panel slot="panel" part="tab-panel" ?hidden=${hidden}>
      ${content}
    </api-viewer-panel>
  `;
};

@customElement('api-viewer-docs')
export class ApiViewerDocs extends LitElement {
  @property() name = '';

  @property({ attribute: false })
  members: Manifest.ClassMember[] = [];

  @property({ attribute: false })
  attrs: Manifest.Attribute[] = [];

  @property({ attribute: false })
  slots: Manifest.Slot[] = [];

  @property({ attribute: false })
  events: Manifest.Event[] = [];

  @property({ attribute: false })
  cssParts: Manifest.CssPart[] = [];

  @property({ attribute: false })
  cssProps: Manifest.CssCustomProperty[] = [];

  protected createRenderRoot(): ApiViewerDocs {
    return this;
  }

  protected render(): TemplateResult {
    const { slots, members = [], attrs, events, cssParts, cssProps } = this;

    const attributes = (attrs || []).filter(
      ({ name }) => !members.some(isPropMatch(name))
    );

    const emptyDocs = [
      members,
      attributes,
      slots,
      events,
      cssProps,
      cssParts
    ].every((arr) => arr.length === 0);

    const properties = emptyDocs ? [] : members.filter(isClassField);
    const methods = emptyDocs ? [] : members.filter(isClassMethod);

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
              properties,
              html`
                ${properties.map((prop) => {
                  const { name, description = '', type } = prop;
                  const attribute = attributes.find(
                    (attr) => attr.fieldName === name
                  );
                  return renderItem(
                    'prop',
                    name,
                    description,
                    type?.text ?? '',
                    prop.default,
                    attribute?.name
                  );
                })}
              `
            )}
            ${renderTab(
              'Attributes',
              attributes,
              html`
                ${attributes.map(({ name, description = '', type }) =>
                  renderItem('attr', name, description, type?.text)
                )}
              `
            )}
            ${renderTab(
              'Slots',
              slots,
              html`
                ${slots.map(({ name, description = '' }) =>
                  renderItem('slot', name, description)
                )}
              `
            )}
            ${renderTab(
              'Events',
              events,
              html`
                ${events.map(({ name, description = '' }) =>
                  renderItem('event', name, description)
                )}
              `
            )}
            ${renderTab(
              'CSS Custom Properties',
              cssProps,
              html`
                ${cssProps.map((prop) => {
                  const { name, description = '' } = prop;
                  return renderItem(
                    'css',
                    name,
                    description,
                    '',
                    unquote(prop.default)
                  );
                })}
              `
            )}
            ${renderTab(
              'CSS Shadow Parts',
              cssParts,
              html`
                ${cssParts.map(({ name, description = '' }) =>
                  renderItem('part', name, description)
                )}
              `
            )}
          </api-viewer-tabs>
        `;
  }

  protected updated(props: PropertyValues): void {
    if (props.has('name') && props.get('name')) {
      const tabs = this.renderRoot.querySelector('api-viewer-tabs');
      if (tabs) {
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
