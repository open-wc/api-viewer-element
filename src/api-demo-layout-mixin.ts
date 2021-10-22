import { LitElement, property, PropertyValues } from 'lit-element';
import { getSlotDefault } from './lib/knobs.js';
import {
  ComponentWithProps,
  CSSPropertyInfo,
  PropertyInfo,
  SlotInfo,
  SlotValue,
  EventInfo,
  KnobValues,
  KnobValue
} from './lib/types.js';
import {
  getTemplates,
  hasTemplate,
  isPropMatch,
  normalizeType,
  TemplateTypes,
  unquote,
  getTemplateNode
} from './lib/utils.js';

const { HOST, KNOB } = TemplateTypes;

const getDefault = (
  prop: PropertyInfo
): string | number | boolean | null | undefined => {
  const { type, default: value } = prop;
  switch (normalizeType(type)) {
    case 'boolean':
      return value !== 'false';
    case 'number':
      return Number(value);
    default:
      return unquote(value as string);
  }
};

type CustomElement = new () => HTMLElement;

// TODO: remove when analyzer outputs "readOnly" to JSON
const isGetter = (element: Element, prop: string): boolean => {
  function getDescriptor(obj: CustomElement): PropertyDescriptor | undefined {
    return obj === HTMLElement
      ? undefined
      : Object.getOwnPropertyDescriptor(obj.prototype, prop) ||
          getDescriptor(Object.getPrototypeOf(obj));
  }

  let result = false;
  if (element) {
    const descriptor = getDescriptor(element.constructor as CustomElement);
    result = Boolean(
      descriptor && descriptor.get && descriptor.set === undefined
    );
  }
  return result;
};

/* eslint-disable @typescript-eslint/no-explicit-any */
export type Constructor<T = unknown> = new (...args: any[]) => T;

export interface ApiDemoLayoutInterface {
  tag: string;
  props: PropertyInfo[];
  slots: SlotInfo[];
  events: EventInfo[];
  cssProps: CSSPropertyInfo[];
  exclude: string;
  vid?: number;
  processedSlots: SlotValue[];
  processedCss: CSSPropertyInfo[];
  eventLog: CustomEvent[];
  customKnobs: PropertyInfo[];
  knobs: KnobValues;
  setKnobs(target: HTMLInputElement): void;
  setSlots(target: HTMLInputElement): void;
  setCss(target: HTMLInputElement): void;
  onRendered(event: CustomEvent): void;
}

export const ApiDemoLayoutMixin = <T extends Constructor<LitElement>>(
  base: T
): T & Constructor<ApiDemoLayoutInterface> => {
  class DemoLayout extends base {
    @property() tag = '';

    @property({ attribute: false })
    props: PropertyInfo[] = [];

    @property({ attribute: false })
    slots: SlotInfo[] = [];

    @property({ attribute: false })
    events: EventInfo[] = [];

    @property({ attribute: false })
    cssProps: CSSPropertyInfo[] = [];

    @property() exclude = '';

    @property({ type: Number }) vid?: number;

    @property({ attribute: false })
    processedSlots: SlotValue[] = [];

    @property({ attribute: false })
    processedCss: CSSPropertyInfo[] = [];

    @property({ attribute: false })
    eventLog: CustomEvent[] = [];

    @property({ attribute: false })
    customKnobs: PropertyInfo[] = [];

    @property({ attribute: false })
    knobs: KnobValues = {};

    private _savedProps: PropertyInfo[] = [];

    protected firstUpdated(props: PropertyValues): void {
      // When a selected tag name is changed by the user,
      // the whole api-viewer-demo component is re-rendered,
      // so this callback is invoked again for new element.
      if (props.has('props')) {
        const element = document.createElement(this.tag);
        // Store properties without getters
        this._savedProps = this.props.filter(
          ({ name }) => !isGetter(element, name)
        );
      }
      this.customKnobs = this._getCustomKnobs();
    }

    protected updated(props: PropertyValues): void {
      if (props.has('exclude')) {
        this.props = this._filterProps();
      }

      if (props.has('slots') && this.slots) {
        this.processedSlots = this.slots
          .sort((a: SlotInfo, b: SlotInfo) => {
            if (a.name === '') {
              return 1;
            }
            if (b.name === '') {
              return -1;
            }
            return a.name.localeCompare(b.name);
          })
          .map((slot: SlotInfo) => {
            return {
              ...slot,
              content: getSlotDefault(slot.name, 'content')
            };
          });
      }
    }

    private _getCustomKnobs(): PropertyInfo[] {
      return getTemplates(this.vid as number, this.tag, KNOB)
        .map((template) => {
          const { attr, type } = template.dataset;
          let result = null;
          if (attr) {
            if (type === 'select') {
              const node = getTemplateNode(template);
              const options = node
                ? Array.from(node.children)
                    .filter(
                      (c): c is HTMLOptionElement =>
                        c instanceof HTMLOptionElement
                    )
                    .map((option) => option.value)
                : [];
              if (node instanceof HTMLSelectElement && options.length > 1) {
                result = {
                  name: attr,
                  attribute: attr,
                  type,
                  options
                };
              }
            }
            if (type === 'string' || type === 'boolean') {
              result = {
                name: attr,
                attribute: attr,
                type
              };
            }
          }
          return result;
        })
        .filter(Boolean) as PropertyInfo[];
    }

    private _filterProps(): PropertyInfo[] {
      const exclude = this.exclude.split(',');
      return this._savedProps
        .filter(({ name }) => !exclude.includes(name))
        .map((prop: PropertyInfo) => {
          return typeof prop.default === 'string'
            ? {
                ...prop,
                value: getDefault(prop)
              }
            : prop;
        });
    }

    private _getProp(name: string): { prop?: PropertyInfo; custom?: boolean } {
      const isMatch = isPropMatch(name);
      const prop = this.props.find(isMatch);
      return prop
        ? { prop }
        : {
            prop: this.customKnobs.find(isMatch),
            custom: true
          };
    }

    setCss(target: HTMLInputElement): void {
      const { value, dataset } = target;

      this.processedCss = this.processedCss.map((prop) => {
        return prop.name === dataset.name
          ? {
              ...prop,
              value
            }
          : prop;
      });
    }

    setKnobs(target: HTMLInputElement): void {
      const { name, type } = target.dataset;
      let value;
      switch (normalizeType(type)) {
        case 'boolean':
          value = target.checked;
          break;
        case 'number':
          value = target.value === '' ? null : Number(target.value);
          break;
        default:
          value = target.value;
      }

      const { prop, custom } = this._getProp(name as string);
      if (prop) {
        const { attribute } = prop;
        this.knobs = {
          ...this.knobs,
          [name as string]: { type, value, attribute, custom } as KnobValue
        };
      }
    }

    setSlots(target: HTMLInputElement): void {
      const name = target.dataset.slot;
      const content = target.value;

      this.processedSlots = this.processedSlots.map((slot) => {
        return slot.name === name
          ? {
              ...slot,
              content
            }
          : slot;
      });
    }

    onRendered(e: CustomEvent): void {
      const { component } = e.detail;

      if (hasTemplate(this.vid as number, this.tag, HOST)) {
        // Apply property values from template
        this.props
          .filter((prop) => {
            const { name, type } = prop;
            const defaultValue = getDefault(prop);
            return (
              component[name] !== defaultValue ||
              (normalizeType(type) === 'boolean' && defaultValue)
            );
          })
          .forEach((prop) => {
            this._syncKnob(component, prop);
          });
      }

      this.events.forEach((event) => {
        component.addEventListener(event.name, ((evt: CustomEvent) => {
          const s = '-changed';
          if (event.name.endsWith(s)) {
            const { prop } = this._getProp(event.name.replace(s, ''));
            if (prop) {
              this._syncKnob(component, prop);
            }
          }

          this.eventLog = [...this.eventLog, evt];
        }) as EventListener);
      });

      if (this.cssProps.length) {
        const style = getComputedStyle(component);

        this.processedCss = this.cssProps.map((cssProp) => {
          let value = cssProp.default
            ? unquote(cssProp.default)
            : style.getPropertyValue(cssProp.name);
          const result = cssProp;
          if (value) {
            value = value.trim();
            result.default = value;
            result.value = value;
          }
          return result;
        });
      }
    }

    private _syncKnob(component: Element, changed: PropertyInfo): void {
      const { name, type, attribute } = changed;
      const value = (component as unknown as ComponentWithProps)[name];

      // update knobs to avoid duplicate event
      this.knobs = {
        ...this.knobs,
        [name]: { type, value, attribute }
      };

      this.props = this.props.map((prop) => {
        return prop.name === name
          ? {
              ...prop,
              value
            }
          : prop;
      });
    }
  }

  return DemoLayout;
};
