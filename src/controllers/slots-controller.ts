import { ReactiveController, ReactiveControllerHost } from 'lit';
import { getSlotDefault } from '../lib/knobs.js';
import { SlotInfo, SlotValue } from '../lib/types.js';
import { hasTemplate, TemplateTypes } from '../lib/utils.js';

export class SlotsController implements ReactiveController {
  host: ReactiveControllerHost;

  enabled: boolean;

  el: HTMLElement;

  private _slots: SlotValue[] = [];

  get slots(): SlotValue[] {
    return this._slots;
  }

  set slots(slots: SlotValue[]) {
    this._slots = slots;

    // Apply slots content by re-creating nodes
    if (this.enabled && this.el.isConnected && slots && slots.length) {
      this.el.innerHTML = '';
      slots.forEach((slot) => {
        let node: Element | Text;
        const { name, content } = slot;
        if (name) {
          node = document.createElement('div');
          node.setAttribute('slot', name);
          node.textContent = content;
        } else {
          node = document.createTextNode(content);
        }
        this.el.appendChild(node);
      });
    }

    // Update the demo snippet
    this.host.requestUpdate();
  }

  constructor(
    host: ReactiveControllerHost,
    id: number,
    component: HTMLElement,
    slots: SlotInfo[]
  ) {
    (this.host = host).addController(this as ReactiveController);
    this.el = component;
    this.enabled = !hasTemplate(id, component.localName, TemplateTypes.SLOT);
    this.slots = slots
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
      }) as SlotValue[];
  }

  hostDisconnected() {
    this.slots = [];
  }

  setValue(name: string, content: string) {
    this.slots = this.slots.map((slot) => {
      return slot.name === name
        ? {
            ...slot,
            content
          }
        : slot;
    });
  }
}
