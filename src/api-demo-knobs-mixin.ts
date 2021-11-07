import { LitElement, PropertyValues } from 'lit';
import { property } from 'lit/decorators/property.js';
import { getSlotDefault, Knob } from './lib/knobs.js';
import {
  ComponentWithProps,
  CSSPropertyInfo,
  PropertyInfo,
  SlotInfo,
  SlotValue,
  EventInfo
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
  prop: Knob<PropertyInfo>
): string | number | boolean | null | undefined => {
  const { knobType, default: value } = prop;
  switch (knobType) {
    case 'boolean':
      return value !== 'false';
    case 'number':
      return Number(value);
    default:
      return unquote(value as string);
  }
};

// TODO: remove when analyzer outputs "readOnly" to JSON
const isGetter = (
  ctor: CustomElementConstructor | undefined,
  prop: string
): boolean => {
  function getDescriptor(
    obj: CustomElementConstructor
  ): PropertyDescriptor | undefined {
    return obj === HTMLElement
      ? undefined
      : Object.getOwnPropertyDescriptor(obj.prototype, prop) ||
          getDescriptor(Object.getPrototypeOf(obj));
  }

  let result = false;
  if (ctor) {
    const descriptor = getDescriptor(ctor);
    result = Boolean(
      descriptor && descriptor.get && descriptor.set === undefined
    );
  }
  return result;
};

const getKnobs = (
  tag: string,
  props: PropertyInfo[],
  exclude = ''
): Knob<PropertyInfo>[] => {
  // Exclude getters and specific properties
  let propKnobs = props.filter(
    ({ name }) =>
      !exclude.includes(name) && !isGetter(customElements.get(tag), name)
  ) as Knob<PropertyInfo>[];

  // Set knob types and default knobs values
  propKnobs = propKnobs.map((prop) => {
    const knob = {
      ...prop,
      knobType: normalizeType(prop.type)
    };

    if (typeof knob.default === 'string') {
      knob.value = getDefault(knob);
    }

    return knob;
  });

  return propKnobs;
};

const getCustomKnobs = (tag: string, vid?: number): Knob<PropertyInfo>[] => {
  return getTemplates(vid as number, tag, KNOB)
    .map((template) => {
      const { attr, type } = template.dataset;
      let result = null;
      if (attr) {
        if (type === 'select') {
          const node = getTemplateNode(template);
          const options = node
            ? Array.from(node.children)
                .filter(
                  (c): c is HTMLOptionElement => c instanceof HTMLOptionElement
                )
                .map((option) => option.value)
            : [];
          if (node instanceof HTMLSelectElement && options.length > 1) {
            result = {
              name: attr,
              attribute: attr,
              knobType: type,
              options
            };
          }
        }
        if (type === 'string' || type === 'boolean') {
          result = {
            name: attr,
            attribute: attr,
            knobType: type
          };
        }
      }
      return result as Knob<PropertyInfo>;
    })
    .filter(Boolean);
};

/* eslint-disable @typescript-eslint/no-explicit-any */
export type Constructor<T = unknown> = new (...args: any[]) => T;

export interface ApiDemoKnobsInterface {
  tag: string;
  props: PropertyInfo[];
  propKnobs: Knob<PropertyInfo>[];
  slots: SlotInfo[];
  events: EventInfo[];
  cssProps: CSSPropertyInfo[];
  exclude: string;
  vid?: number;
  processedSlots: SlotValue[];
  processedCss: CSSPropertyInfo[];
  eventLog: CustomEvent[];
  customKnobs: Knob<PropertyInfo>[];
  knobs: Record<string, Knob>;
  setKnobs(target: HTMLInputElement): void;
  setSlots(target: HTMLInputElement): void;
  setCss(target: HTMLInputElement): void;
  onRendered(event: CustomEvent): void;
}

export const ApiDemoKnobsMixin = <T extends Constructor<LitElement>>(
  base: T
): T & Constructor<ApiDemoKnobsInterface> => {
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
    processedSlots!: SlotValue[];

    @property({ attribute: false })
    processedCss!: CSSPropertyInfo[];

    @property({ attribute: false })
    eventLog!: CustomEvent[];

    @property({ attribute: false })
    customKnobs: Knob<PropertyInfo>[] = [];

    @property({ attribute: false })
    knobs: Record<string, Knob> = {};

    @property({ attribute: false })
    propKnobs!: Knob<PropertyInfo>[];

    willUpdate(props: PropertyValues) {
      // Reset state if tag changed
      if (props.has('tag')) {
        this.knobs = {};
        this.eventLog = [];
        this.processedCss = [];
        this.processedSlots = [];
        this.propKnobs = getKnobs(this.tag, this.props, this.exclude);
        this.customKnobs = getCustomKnobs(this.tag, this.vid);
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

    private _getProp(name: string): {
      prop: Knob<PropertyInfo>;
      custom?: boolean;
    } {
      const isMatch = isPropMatch(name);
      let prop = this.propKnobs.find(isMatch);
      let custom = false;
      if (!prop) {
        prop = this.customKnobs.find(isMatch) as Knob<PropertyInfo>;
        custom = true;
      }
      return { prop, custom };
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
      switch (type) {
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
          [name as string]: {
            knobType: type,
            value,
            attribute,
            custom
          } as Knob<PropertyInfo>
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
        this.propKnobs
          .filter((prop) => {
            const { name, knobType } = prop;
            const defaultValue = getDefault(prop);
            return (
              component[name] !== defaultValue ||
              (knobType === 'boolean' && defaultValue)
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

    private _syncKnob(component: Element, changed: Knob<PropertyInfo>): void {
      const { name, knobType, attribute } = changed;
      const value = (component as unknown as ComponentWithProps)[name];

      // update knobs to avoid duplicate event
      this.knobs = {
        ...this.knobs,
        [name]: { knobType, value, attribute }
      };

      this.propKnobs = this.propKnobs.map((prop) => {
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
