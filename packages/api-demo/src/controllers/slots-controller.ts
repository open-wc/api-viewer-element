import type { Slot } from '@api-viewer/common/lib/index.js';
import {
  hasTemplate,
  TemplateTypes
} from '@api-viewer/common/lib/templates.js';
import {
  AbstractController,
  type AbstractControllerHost
} from './abstract-controller.js';
import { formatSlot } from '../ui/controls.js';
import type { SlotValue } from '../types.js';

export class SlotsController extends AbstractController<SlotValue> {
  enabled: boolean;

  constructor(
    host: AbstractControllerHost,
    component: HTMLElement,
    id: number,
    slots: Slot[]
  ) {
    super(host, component);

    this.enabled = !hasTemplate(id, component.localName, TemplateTypes.SLOT);
    this.data = slots
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
        content: formatSlot(slot.name)
      })) as SlotValue[];
  }

  setValue(name: string, content: string) {
    this.data = this.data.map((slot) =>
      slot.name === name ? { ...slot, content } : slot
    );
  }

  updateData(data: SlotValue[]) {
    super.updateData(data);

    // Apply slots content by re-creating nodes
    if (this.enabled && this.el.isConnected && data && data.length) {
      this.el.innerHTML = '';
      data.forEach((slot) => {
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
  }
}
