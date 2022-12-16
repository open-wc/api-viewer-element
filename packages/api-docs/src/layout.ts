import {
  html,
  nothing,
  LitElement,
  type PropertyValues,
  type TemplateResult
} from 'lit';
import { property } from 'lit/decorators/property.js';
import {
  unquote,
  type Attribute,
  type ClassField,
  type ClassMethod,
  type CssCustomProperty,
  type CssPart,
  type Event,
  type Slot
} from '@api-viewer/common/lib/index.js';
import '@api-viewer/tabs';
import { parse } from './utils/markdown.js';

const renderItem = (
  prefix: string,
  name: string | TemplateResult,
  description?: string,
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
  array: unknown[],
  content: TemplateResult
): TemplateResult => {
  const hidden = array.length === 0;
  return html`
    <api-viewer-tab slot="tab" part="tab" ?hidden=${hidden}>
      ${heading}
    </api-viewer-tab>
    <api-viewer-panel slot="panel" part="tab-panel" ?hidden=${hidden}>
      ${content}
    </api-viewer-panel>
  `;
};

const renderMethod = (method: ClassMethod): TemplateResult => {
  const params = method.parameters || [];
  const type = method.return?.type?.text || 'void';

  return html`
    <span part="docs-method">
      ${method.name}(<span part="docs-method-params"
        >${params.map(
          (param, idx) =>
            html`<span part="docs-param-name">${param.name}</span>:
              <span part="docs-param-type">${param.type?.text}</span>${idx ===
              params.length - 1
                ? ''
                : ', '}`
        )}</span
      >)</span
    ><span part="docs-method-type">: ${type}</span>
  `;
};

class ApiDocsLayout extends LitElement {
  @property() name = '';

  @property({ attribute: false })
  props: ClassField[] = [];

  @property({ attribute: false })
  attrs: Attribute[] = [];

  @property({ attribute: false })
  methods: ClassMethod[] = [];

  @property({ attribute: false })
  slots: Slot[] = [];

  @property({ attribute: false })
  events: Event[] = [];

  @property({ attribute: false })
  cssParts: CssPart[] = [];

  @property({ attribute: false })
  cssProps: CssCustomProperty[] = [];

  protected createRenderRoot(): this {
    return this;
  }

  protected render(): TemplateResult {
    const { slots, props, attrs, methods, events, cssParts, cssProps } = this;

    const emptyDocs = [
      props,
      attrs,
      methods,
      slots,
      events,
      cssProps,
      cssParts
    ].every((arr) => arr.length === 0);

    const attributes = attrs.filter(
      (x) => !props.some((y) => y.name === x.fieldName)
    );

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
              props,
              html`
                ${props.map((prop) => {
                  const { name, description, type } = prop;
                  const attribute = attrs.find((x) => x.fieldName === name);
                  return renderItem(
                    'prop',
                    name,
                    description,
                    type?.text,
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
                ${attributes.map(({ name, description, type }) =>
                  renderItem('attr', name, description, type?.text)
                )}
              `
            )}
            ${renderTab(
              'Methods',
              methods,
              html`
                ${methods.map((method) =>
                  renderItem('method', renderMethod(method), method.description)
                )}
              `
            )}
            ${renderTab(
              'Slots',
              slots,
              html`
                ${slots.map(({ name, description }) =>
                  renderItem('slot', name, description)
                )}
              `
            )}
            ${renderTab(
              'Events',
              events,
              html`
                ${events.map(({ name, description }) =>
                  renderItem('event', name, description)
                )}
              `
            )}
            ${renderTab(
              'CSS Custom Properties',
              cssProps,
              html`
                ${cssProps.map((prop) => {
                  const { name, description } = prop;
                  return renderItem(
                    'css',
                    name,
                    description,
                    '', // TODO: manifest does not provide type for CSS custom properties
                    unquote(prop.default)
                  );
                })}
              `
            )}
            ${renderTab(
              'CSS Shadow Parts',
              cssParts,
              html`
                ${cssParts.map(({ name, description }) =>
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

customElements.define('api-docs-layout', ApiDocsLayout);

declare global {
  interface HTMLElementTagNameMap {
    'api-docs-layout': ApiDocsLayout;
  }
}
