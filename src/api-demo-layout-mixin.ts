import type {
  Attribute,
  ClassField,
  ClassMember,
  CssCustomProperty,
  Event,
  Slot
} from 'custom-elements-manifest/schema';

import { LitElement, PropertyValues } from 'lit';
import { property } from 'lit/decorators/property.js';
import { getSlotDefault, Knob } from './lib/knobs.js';
import {
  ComponentWithProps,
  SlotValue,
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
  getTemplateNode,
  isClassField
} from './lib/utils.js';

const { HOST, KNOB } = TemplateTypes;

const getDefault = (
  prop: ClassField
): string | number | boolean | null | undefined => {
  const { type, default: value } = prop;
  switch (normalizeType(type?.text)) {
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

/* eslint-disable @typescript-eslint/no-explicit-any */
export type Constructor<T = unknown> = new (...args: any[]) => T;

export interface ApiDemoLayoutInterface {
  tag: string;
  members: ClassMember[];
  finalProps: Knob<ClassField>[];
  slots: Slot[];
  events: Event[];
  cssProps: Knob<CssCustomProperty>[];
  exclude: string;
  vid?: number;
  processedSlots: Knob<SlotValue>[];
  processedCss: CssCustomProperty[];
  eventLog: CustomEvent[];
  customKnobs: Knob<ClassField>[];
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

    @property({ attribute: false }) members: ClassMember[] = [];

    @property({ attribute: false }) attrs: Attribute[] = [];

    @property({ attribute: false }) slots: Slot[] = [];

    @property({ attribute: false }) events: Event[] = [];

    @property({ attribute: false }) cssProps: CssCustomProperty[] = [];

    @property() exclude = '';

    @property({ type: Number }) vid?: number;

    @property({ attribute: false }) processedSlots!: SlotValue[];

    @property({ attribute: false }) processedCss!: CssCustomProperty[];

    @property({ attribute: false }) eventLog!: CustomEvent[];

    @property({ attribute: false }) customKnobs: (ClassField & {
      options?: string[];
    })[] = [];

    @property({ attribute: false }) knobs: KnobValues = {};

    @property({ attribute: false }) finalProps!: ClassField[];

    willUpdate(props: PropertyValues) {
      // Reset state if tag changed
      if (props.has('tag')) {
        this.knobs = {};
        this.eventLog = [];
        this.processedCss = [];
        this.processedSlots = [];

        // Store properties without getters
        this.finalProps = this.members.filter(
          (x): x is ClassField =>
            isClassField(x) && !isGetter(customElements.get(this.tag), x.name)
        );

        this.customKnobs = this._getCustomKnobs();
      }

      if (props.has('exclude')) {
        this.finalProps = this.finalProps
          .filter(({ name }) => !this.exclude.includes(name))
          .map((prop) => {
            return typeof prop.default === 'string'
              ? {
                  ...prop,
                  value: getDefault(prop)
                }
              : prop;
          });
      }
    }

    protected updated(props: PropertyValues): void {
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

    private _getCustomKnobs(): (ClassField & { options?: string[] })[] {
      return getTemplates(this.vid as number, this.tag, KNOB)
        .map((template) => {
          const { attr, type } = template.dataset;
          let result:
            | (Omit<ClassField, 'kind'> & { options?: string[] })
            | null = null;
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
                  type: { text: type },
                  options
                };
              }
            }
            if (type === 'string' || type === 'boolean') {
              result = {
                name: attr,
                type: { text: type }
              };
            }
          }
          return {
            ...(result as ClassField & { options?: string[] }),
            kind: 'field' as const
          };
        })
        .filter(Boolean);
    }

    private _getProp(name: string): { prop?: ClassField; custom?: boolean } {
      const isMatch = isPropMatch(name);
      const prop = this.finalProps.find(isMatch);
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
        const attribute = this.attrs.find((x) => x.fieldName === name);
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
        this.finalProps
          .filter((prop) => {
            const { name, type } = prop;
            const defaultValue = getDefault(prop);
            return (
              component[name] !== defaultValue ||
              (normalizeType(type?.text) === 'boolean' && defaultValue)
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
          const result: CssCustomProperty & { value?: string } = cssProp;
          if (value) {
            value = value.trim();
            result.default = value;
            result.value = value;
          }
          return result;
        });
      }
    }

    private _syncKnob(component: Element, changed: ClassField): void {
      const { name, type } = changed;
      const attribute = this.attrs.find((x) => x.fieldName === name)?.name;
      const value = (component as unknown as ComponentWithProps)[name];

      // update knobs to avoid duplicate event
      this.knobs = {
        ...this.knobs,
        [name]: { type: type?.text ?? '', value, attribute }
      };

      this.finalProps = this.finalProps.map((prop) => {
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
