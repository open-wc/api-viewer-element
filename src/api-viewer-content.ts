import { LitElement, html, customElement, css, property } from 'lit-element';
import { nothing, TemplateResult } from 'lit-html';
import {
  ElementInfo,
  PropertyInfo,
  AttributeInfo,
  EventInfo
} from './lib/types.js';
import { EMPTY_ELEMENT } from './lib/constants.js';
import './api-viewer-item.js';
import './api-viewer-panel.js';
import './api-viewer-tab.js';
import './api-viewer-tabs.js';

const NOTHING = html`
  ${nothing}
`;

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

@customElement('api-viewer-content')
export class ApiViewerContent extends LitElement {
  @property({ attribute: false }) element: ElementInfo = EMPTY_ELEMENT;

  static get styles() {
    return css`
      :host {
        display: block;
      }
    `;
  }

  // eslint-disable-next-line class-methods-use-this
  protected renderProperties(props?: PropertyInfo[]): TemplateResult {
    return props && props.length
      ? html`
          <api-viewer-tab heading="Properties" slot="tab"></api-viewer-tab>
          <api-viewer-panel slot="panel">
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
          </api-viewer-panel>
        `
      : NOTHING;
  }

  // eslint-disable-next-line class-methods-use-this
  protected renderAttributes(attrs?: AttributeInfo[]): TemplateResult {
    return attrs && attrs.length
      ? html`
          <api-viewer-tab heading="Attributes" slot="tab"></api-viewer-tab>
          <api-viewer-panel slot="panel">
            ${attrs.map(
              attr => html`
                <api-viewer-item
                  .name="${attr.name}"
                  .description="${attr.description}"
                  .valueType="${attr.type}"
                ></api-viewer-item>
              `
            )}
          </api-viewer-panel>
        `
      : NOTHING;
  }

  // eslint-disable-next-line class-methods-use-this
  protected renderSlots(slots?: EventInfo[]): TemplateResult {
    return slots && slots.length
      ? html`
          <api-viewer-tab heading="Slots" slot="tab"></api-viewer-tab>
          <api-viewer-panel slot="panel">
            ${slots.map(
              slot => html`
                <api-viewer-item
                  .name="${slot.name}"
                  .description="${slot.description}"
                ></api-viewer-item>
              `
            )}
          </api-viewer-panel>
        `
      : NOTHING;
  }

  // eslint-disable-next-line class-methods-use-this
  protected renderEvents(events?: EventInfo[]): TemplateResult {
    return events && events.length
      ? html`
          <api-viewer-tab heading="Events" slot="tab"></api-viewer-tab>
          <api-viewer-panel slot="panel">
            ${events.map(
              event => html`
                <api-viewer-item
                  .name="${event.name}"
                  .description="${event.description}"
                ></api-viewer-item>
              `
            )}
          </api-viewer-panel>
        `
      : NOTHING;
  }

  render() {
    const { slots, properties, attributes, events } = this.element;

    const attrs = processAttrs(attributes || [], properties || []);
    const props = processProps(properties || [], attributes || []);

    return html`
      <api-viewer-tabs>
        ${this.renderProperties(props)}${this.renderAttributes(attrs)}
        ${this.renderSlots(slots)}${this.renderEvents(events)}
      </api-viewer-tabs>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'api-viewer-content': ApiViewerContent;
  }
}
