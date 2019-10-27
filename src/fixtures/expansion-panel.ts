import {
  LitElement,
  html,
  css,
  customElement,
  property,
  query,
  PropertyValues
} from 'lit-element';
import { styleMap } from 'lit-html/directives/style-map.js';

/**
 * A custom element similar to the HTML5 `<details>` element.
 *
 * @element expansion-panel
 *
 * @slot - Slot fot panel content
 * @slot header - Slot for panel header
 *
 * @attr {Boolean} focused - State attribute set when element has focus.
 *
 * @fires opened-changed - Event fired when expanding / collapsing
 */
@customElement('expansion-panel')
export class ExpansionPanel extends LitElement {
  /**
   * When true, the panel content is expanded and visible
   */
  @property({ type: Boolean, reflect: true }) opened = false;

  /**
   * Disabled panel can not be expanded or collapsed
   */
  @property({ type: Boolean, reflect: true }) disabled = false;

  @query('[part="header"]')
  protected header?: HTMLDivElement;

  protected _isShiftTabbing = false;

  static get styles() {
    return css`
      :host {
        display: block;
        outline: none;
        box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14),
          0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2);
      }

      :host([hidden]) {
        display: none !important;
      }

      [part='content'] {
        display: none;
        overflow: hidden;
        padding: 16px 24px 24px;
      }

      [part='header'] {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        position: relative;
        outline: none;
        min-height: 48px;
        padding: 0 24px;
        box-sizing: border-box;
        font-weight: 500;
        font-size: 13px;
        background-color: #fff;
        color: rgba(0, 0, 0, 0.87);
        cursor: default;
        -webkit-tap-highlight-color: transparent;
      }

      :host([disabled]) [part='header'] {
        color: rgba(0, 0, 0, 0.38);
        background: rgba(0, 0, 0, 0.26);
        pointer-events: none;
      }

      :host([opened]) [part='content'] {
        display: block;
        overflow: visible;
      }

      :host([focused]) [part='header'] {
        background: rgba(0, 0, 0, 0.08);
      }

      [part='header'] ::slotted(*) {
        margin: 12px 0;
      }

      [part='toggle'] {
        position: absolute;
        order: 1;
        right: 8px;
        width: 24px;
        height: 24px;
        padding: 4px;
        color: var(--material-secondary-text-color);
        line-height: 24px;
        text-align: center;
        transform: rotate(90deg);
        transition: transform 0.1s cubic-bezier(0.4, 0, 0.2, 0.1);
      }

      [part='toggle']::before {
        font-size: 24px;
        width: 24px;
        display: inline-block;
        content: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>');
      }

      [part='toggle']::after {
        display: inline-block;
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: rgba(0, 0, 0, 0.38);
        transform: scale(0);
        opacity: 0;
        transition: transform 0s 0.8s, opacity 0.8s;
        will-change: transform, opacity;
      }

      :host([disabled]) [part='toggle'] {
        color: rgba(0, 0, 0, 0.26);
      }

      :host(:not([disabled])) [part='header']:active [part='toggle']::after {
        transition-duration: 0.08s, 0.01s;
        transition-delay: 0s, 0s;
        transform: scale(1.25);
        opacity: 0.15;
      }

      :host([opened]) [part='toggle'] {
        transform: rotate(270deg);
      }
    `;
  }

  render() {
    return html`
      <div role="heading">
        <div
          role="button"
          part="header"
          @click="${this._onToggleClick}"
          @keydown="${this._onToggleKeyDown}"
          aria-expanded="${this.opened ? 'true' : 'false'}"
          tabindex="0"
        >
          <span part="toggle"></span>
          <slot name="header"></slot>
        </div>
      </div>
      <div
        part="content"
        style="${styleMap({ maxHeight: this.opened ? '' : '0px' })}"
        aria-hidden="${this.opened ? 'false' : 'true'}"
      >
        <slot></slot>
      </div>
    `;
  }

  focus() {
    if (this.header) {
      this.header.focus();
    }
  }

  protected firstUpdated() {
    this.setAttribute('tabindex', '0');
    this.addEventListener('focusin', e => {
      if (e.composedPath()[0] === this) {
        if (this._isShiftTabbing) {
          return;
        }
        this._setFocused(true);
        this.focus();
      } else if (
        this.header &&
        e.composedPath().indexOf(this.header) !== -1 &&
        !this.disabled
      ) {
        this._setFocused(true);
      }
    });

    this.addEventListener('focusout', () => this._setFocused(false));

    this.addEventListener('keydown', e => {
      if (e.shiftKey && e.keyCode === 9) {
        this._isShiftTabbing = true;
        HTMLElement.prototype.focus.apply(this);
        this._setFocused(false);
        setTimeout(() => {
          this._isShiftTabbing = false;
        }, 0);
      }
    });
  }

  protected updated(props: PropertyValues) {
    super.updated(props);

    if (props.has('opened')) {
      this.dispatchEvent(
        new CustomEvent('opened-changed', {
          detail: { value: this.opened }
        })
      );
    }

    if (props.has('disabled') && this.header) {
      if (this.disabled) {
        this.removeAttribute('tabindex');
        this.header.setAttribute('tabindex', '-1');
      } else if (props.get('disabled')) {
        this.setAttribute('tabindex', '0');
        this.header.setAttribute('tabindex', '0');
      }
    }
  }

  private _setFocused(focused: boolean) {
    if (focused) {
      this.setAttribute('focused', '');
    } else {
      this.removeAttribute('focused');
    }
  }

  private _onToggleClick() {
    this.opened = !this.opened;
  }

  private _onToggleKeyDown(e: KeyboardEvent) {
    if ([13, 32].indexOf(e.keyCode) > -1) {
      e.preventDefault();
      this.opened = !this.opened;
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'expansion-panel': ExpansionPanel;
  }
}
