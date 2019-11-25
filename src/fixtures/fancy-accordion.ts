import {
  LitElement,
  html,
  css,
  customElement,
  property,
  PropertyValues
} from 'lit-element';
import { ExpansionPanel } from './expansion-panel.js';

/**
 * A custom element implementing the accordion widget: a vertically stacked set of expandable panels
 * that wraps several instances of the `<expansion-panel>` element. Only one panel can be opened
 * (expanded) at a time.
 *
 * Panel headings function as controls that enable users to open (expand) or hide (collapse) their
 * associated sections of content. The user can toggle panels by mouse click, Enter and Space keys.
 *
 * The component supports keyboard navigation and is aligned with the
 * [WAI-ARIA Authoring Practices](https://www.w3.org/TR/wai-aria-practices-1.1/#accordion).
 *
 * @element fancy-accordion
 *
 * @slot - Slot fot panel elements.
 *
 * @fires opened-changed - Event fired when expanding / collapsing
 */
@customElement('fancy-accordion')
export class FancyAccordion extends LitElement {
  /**
   * Index of the currently opened panel. First panel is opened by
   * default. Only one panel can be opened at the same time.
   * Setting `undefined` closes all the accordion panels.
   */
  @property({ type: Number }) opened? = 0;

  protected _items: ExpansionPanel[] = [];

  private _boundOnOpened = this._onOpened.bind(this) as EventListener;

  static get styles() {
    return css`
      :host {
        display: block;
      }

      :host([hidden]) {
        display: none !important;
      }

      ::slotted([opened]:not(:first-child)) {
        margin-top: 16px;
      }

      ::slotted([opened]:not(:last-child)) {
        margin-bottom: 16px;
      }

      ::slotted(:not([opened])) {
        position: relative;
      }

      ::slotted(:not([opened]))::after {
        content: '';
        position: absolute;
        bottom: -1px;
        left: 0;
        right: 0;
        height: 1px;
        opacity: 1;
        z-index: 1;
        background-color: rgba(0, 0, 0, 0.12);
      }
    `;
  }

  protected render() {
    return html`
      <slot></slot>
    `;
  }

  protected firstUpdated() {
    this.addEventListener('keydown', e => this._onKeydown(e));

    Array.from(this.children).forEach(node => {
      if (node instanceof ExpansionPanel) {
        this._items.push(node);
        node.addEventListener('opened-changed', this._boundOnOpened);
      }
    });
  }

  protected update(props: PropertyValues) {
    if (props.has('opened') && this._items) {
      const item = this.opened === undefined ? null : this._items[this.opened];
      this._items.forEach(el => {
        el.opened = el === item;
      });
    }

    super.update(props);
  }

  protected get focused() {
    const root = this.getRootNode();
    return ((root as unknown) as DocumentOrShadowRoot).activeElement;
  }

  private _onKeydown(event: KeyboardEvent) {
    const target = event.composedPath()[0] as Element;
    if (target.getAttribute('part') !== 'header') {
      return;
    }
    const key = event.key.replace(/^Arrow/, '');
    const currentIdx = this._items.indexOf(this.focused as ExpansionPanel);
    let idx;
    let increment;
    switch (key) {
      case 'Up':
        increment = -1;
        idx = currentIdx - 1;
        break;
      case 'Down':
        increment = 1;
        idx = currentIdx + 1;
        break;
      case 'Home':
        increment = 1;
        idx = 0;
        break;
      case 'End':
        increment = -1;
        idx = this._items.length - 1;
        break;
      default:
    }
    idx = this._getAvailableIndex(idx, increment);
    if (idx >= 0) {
      this._items[idx].focus();
      this._items[idx].setAttribute('focus-ring', '');
      event.preventDefault();
    }
  }

  private _getAvailableIndex(index?: number, increment?: number) {
    const total = this._items.length;
    let idx = index;
    for (
      let i = 0;
      typeof idx === 'number' && i < total;
      i++, idx += increment || 1
    ) {
      if (idx < 0) {
        idx = total - 1;
      } else if (idx >= total) {
        idx = 0;
      }
      const item = this._items[idx];
      if (!item.disabled) {
        return idx;
      }
    }
    return -1;
  }

  private _onOpened(e: CustomEvent) {
    const target = e.composedPath()[0] as ExpansionPanel;
    const idx = this._items.indexOf(target);
    if (e.detail.value) {
      if (target.disabled || idx === -1) {
        return;
      }

      this.opened = idx;
      this._notifyOpen();

      this._items.forEach(item => {
        if (item !== target && item.opened) {
          item.opened = false;
        }
      });
    } else if (!this._items.some(item => item.opened)) {
      this.opened = undefined;
      this._notifyOpen();
    }
  }

  private _notifyOpen() {
    this.dispatchEvent(
      new CustomEvent('opened-changed', {
        detail: {
          value: this.opened
        }
      })
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'fancy-accordion': FancyAccordion;
  }
}
