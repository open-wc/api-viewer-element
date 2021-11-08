import { LitElement, PropertyValues } from 'lit';
import { property } from 'lit/decorators/property.js';
import { Knob } from './lib/knobs.js';
import { ComponentWithProps, PropertyInfo } from './lib/types.js';
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

export interface HasKnobs {
  getKnob(name: string): { knob: Knob<PropertyInfo>; custom?: boolean };
  syncKnob(component: Element, changed: Knob<PropertyInfo>): void;
}

export interface ApiDemoKnobsInterface extends HasKnobs {
  tag: string;
  props: PropertyInfo[];
  propKnobs: Knob<PropertyInfo>[];
  exclude: string;
  vid?: number;
  customKnobs: Knob<PropertyInfo>[];
  knobs: Record<string, Knob>;
  setKnobs(target: HTMLInputElement): void;
  initKnobs(component: HTMLElement): void;
}

export const ApiDemoKnobsMixin = <T extends Constructor<LitElement>>(
  base: T
): T & Constructor<ApiDemoKnobsInterface> => {
  class DemoLayout extends base {
    @property() tag = '';

    @property({ attribute: false })
    props: PropertyInfo[] = [];

    @property() exclude = '';

    @property({ type: Number }) vid?: number;

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
        this.propKnobs = getKnobs(this.tag, this.props, this.exclude);
        this.customKnobs = getCustomKnobs(this.tag, this.vid);
      }
    }

    getKnob(name: string): {
      knob: Knob<PropertyInfo>;
      custom?: boolean;
    } {
      const isMatch = isPropMatch(name);
      let knob = this.propKnobs.find(isMatch);
      let custom = false;
      if (!knob) {
        knob = this.customKnobs.find(isMatch) as Knob<PropertyInfo>;
        custom = true;
      }
      return { knob, custom };
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

      const { knob, custom } = this.getKnob(name as string);
      if (knob) {
        const { attribute } = knob;
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

    initKnobs(component: HTMLElement) {
      if (hasTemplate(this.vid as number, this.tag, HOST)) {
        // Apply property values from template
        this.propKnobs
          .filter((prop) => {
            const { name, knobType } = prop;
            const defaultValue = getDefault(prop);
            return (
              (component as any)[name] !== defaultValue ||
              (knobType === 'boolean' && defaultValue)
            );
          })
          .forEach((prop) => {
            this.syncKnob(component, prop);
          });
      }
    }

    syncKnob(component: Element, changed: Knob<PropertyInfo>): void {
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
