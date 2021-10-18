import type * as Manifest from 'custom-elements-manifest/schema';
import type { PropertyValues } from 'lit';

import { LitElement } from 'lit';
import { property } from 'lit/decorators.js';

import { getSlotDefault, Knob } from './lib/knobs.js';

import {
  ComponentWithProps,
  KnobValues,
  KnobValue,
  SlotWithContent,
  Prop,
  CSSProp
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
  prop: Prop
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
  members: Prop[];
  slots: Manifest.Slot[];
  events: Manifest.Event[];
  cssProps: Manifest.CssCustomProperty[];
  exclude: string;
  vid?: number;
  processedSlots: SlotWithContent[];
  processedCss: Manifest.CssCustomProperty[];
  eventLog: CustomEvent[];
  customKnobs: Knob[];
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
    members: Prop[] = [];

    @property({ attribute: false })
    slots: Manifest.Slot[] = [];

    @property({ attribute: false })
    events: Manifest.Event[] = [];

    @property({ attribute: false })
    cssProps: CSSProp[] = [];

    @property() exclude = '';

    @property({ type: Number }) vid?: number;

    @property({ attribute: false })
    processedSlots: SlotWithContent[] = [];

    @property({ attribute: false })
    processedCss: Manifest.CssCustomProperty[] = [];

    @property({ attribute: false })
    eventLog: CustomEvent[] = [];

    @property({ attribute: false })
    customKnobs: Knob[] = [];

    @property({ attribute: false })
    knobs: KnobValues = {};

    private _savedProps: Prop[] = [];

    protected firstUpdated(props: PropertyValues) {
      // When a selected tag name is changed by the user,
      // the whole api-viewer-demo component is re-rendered,
      // so this callback is invoked again for new element.
      if (props.has('props')) {
        const element = document.createElement(this.tag);
        // Store properties without getters
        this._savedProps = this.members.filter(
          ({ name }) => !isGetter(element, name)
        );
      }
      this.customKnobs = this._getCustomKnobs();
    }

    protected updated(props: PropertyValues) {
      if (props.has('exclude')) {
        this.members = this._filterProps();
      }

      if (props.has('slots') && this.slots) {
        this.processedSlots = this.slots
          .sort((a, b) => {
            if (a.name === '') {
              return 1;
            }
            if (b.name === '') {
              return -1;
            }
            return a.name.localeCompare(b.name);
          })
          .map((slot) => ({
            ...slot,
            content: getSlotDefault(slot.name, 'content')
          }));
      }
    }

    private _getCustomKnobs(): Knob[] {
      return getTemplates(this.vid as number, this.tag, KNOB)
        .map((template) => {
          const { attr, type } = template.dataset;
          let result: Knob;
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
                  type: { text: type },
                  options
                };
              }
            }
            if (type === 'string' || type === 'boolean') {
              result = {
                name: attr,
                attribute: attr,
                type: { text: type }
              };
            }
          }
          return result;
        })
        .filter(Boolean);
    }

    private _filterProps() {
      const exclude = this.exclude.split(',');
      return this._savedProps
        .filter(({ name }) => !exclude.includes(name))
        .map((prop) =>
          typeof prop.default === 'string'
            ? {
                ...prop,
                value: getDefault(prop)
              }
            : prop
        );
    }

    private _getProp(name: string): { prop?: Prop; custom?: boolean } {
      const isMatch = isPropMatch(name);
      const prop = this.members.find(isMatch);
      return prop
        ? { prop }
        : {
            prop: this.customKnobs.find(isMatch),
            custom: true
          };
    }

    setCss(target: HTMLInputElement) {
      const { value, dataset } = target;

      this.processedCss = this.processedCss.map((prop) =>
        prop.name === dataset.name
          ? {
              ...prop,
              value
            }
          : prop
      );
    }

    setKnobs(target: HTMLInputElement) {
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

    setSlots(target: HTMLInputElement) {
      const name = target.dataset.slot;
      const content = target.value;

      this.processedSlots = this.processedSlots.map((slot) =>
        slot.name === name
          ? {
              ...slot,
              content
            }
          : slot
      );
    }

    onRendered(e: CustomEvent) {
      const { component } = e.detail;

      if (hasTemplate(this.vid as number, this.tag, HOST)) {
        // Apply property values from template
        this.members
          .filter((prop) => {
            // todo: filter methods
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

    private _syncKnob(component: Element, changed: Prop) {
      const { name, type, attribute } = changed;
      const value = (component as unknown as ComponentWithProps)[name];

      // update knobs to avoid duplicate event
      this.knobs = {
        ...this.knobs,
        [name]: { type: type?.text ?? '', value, attribute }
      };

      this.members = this.members.map((prop) =>
        // todo: filter methods
        prop.name === name
          ? {
              ...prop,
              value
            }
          : prop
      );
    }
  }

  return DemoLayout;
};
