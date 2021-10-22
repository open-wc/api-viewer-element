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
 * @attr {boolean} focused - State attribute set when element has focus.
 * @attr {boolean} focus-ring - State attribute set when focused from keyboard.
 *
 * @cssprop {Background} [--panel-header-background=#fff] - Default panel header background color.
 * @cssprop [--panel-header-min-height=48px] - Panel header minimum height.
 * @cssprop {Background} [--panel-ripple-background=rgba(0, 0, 0, 0.38)] - Active toggle button ripple background.
 *
 * @csspart header - An element wrapping the `header` slot.
 * @csspart toggle - A toggle button, child of the header part.
 * @csspart content - An element wrapping the `content` slot.
 *
 * @fires opened-changed - Event fired when expanding / collapsing
 */
@customElement('expansion-panel')
export class ExpansionPanel extends LitElement {
  /**
   * When true, the panel content is expanded and visible
   */
  @property({ type: Boolean, reflect: true }) opened?: boolean | null = false;

  /**
   * Disabled panel can not be expanded or collapsed
   */
  @property({ type: Boolean, reflect: true }) disabled = false;

  @query('[part="header"]')
  protected header?: HTMLDivElement;

  protected _isShiftTabbing = false;

  protected _tabPressed = false;

  private _boundBodyKeydown = this._onBodyKeydown.bind(this);

  private _boundBodyKeyup = this._onBodyKeyup.bind(this);

  static get styles() {
    return css`
      :host {
        display: block;
        outline: none;
        color: rgba(0, 0, 0, 0.87);
        box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14),
          0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2);

        --panel-header-background: #fff;
        --panel-header-min-height: 48px;
        --panel-ripple-background: rgba(0, 0, 0, 0.38);
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
        min-height: var(--panel-header-min-height);
        padding: 0 24px;
        box-sizing: border-box;
        font-weight: 500;
        font-size: 13px;
        background-color: var(--panel-header-background);
        color: inherit;
        cursor: default;
        -webkit-tap-highlight-color: transparent;
      }

      :host([disabled]) [part='header'] {
        filter: brightness(75%);
        opacity: 0.75;
        pointer-events: none;
      }

      :host([opened]) [part='content'] {
        display: block;
        overflow: visible;
      }

      :host([focus-ring]) [part='header'] {
        filter: brightness(90%);
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
        text-align: center;
        transform: rotate(45deg);
        transition: transform 0.1s cubic-bezier(0.4, 0, 0.2, 0.1);
      }

      [part='toggle']::before {
        width: 7px;
        position: absolute;
        height: 7px;
        left: 50%;
        top: 50%;
        content: '';
        border-width: 0 2px 2px 0;
        transform: translateX(-60%) translateY(-60%);
        border-style: solid;
        border-color: currentColor;
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
        background: var(--panel-ripple-background);
        transform: scale(0);
        opacity: 0;
        transition: transform 0s 0.8s, opacity 0.8s;
        will-change: transform, opacity;
      }

      :host(:not([disabled])) [part='header']:active [part='toggle']::after {
        transition-duration: 0.08s, 0.01s;
        transition-delay: 0s, 0s;
        transform: scale(1.25);
        opacity: 0.15;
      }

      :host([opened]) [part='toggle'] {
        transform: rotate(225deg);
      }

      :host([dir='rtl']) [part='toggle'] {
        left: 8px;
        right: auto;
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

  connectedCallback(): void {
    super.connectedCallback();

    document.body.addEventListener('keydown', this._boundBodyKeydown, true);
    document.body.addEventListener('keyup', this._boundBodyKeyup, true);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();

    document.body.removeEventListener('keydown', this._boundBodyKeydown, true);
    document.body.removeEventListener('keyup', this._boundBodyKeyup, true);
  }

  focus(): void {
    if (this.header) {
      this.header.focus();
    }
  }

  protected firstUpdated(): void {
    this.setAttribute('tabindex', '0');
    this.addEventListener('focusin', (e) => {
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

    this.addEventListener('keydown', (e) => {
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

  protected updated(props: PropertyValues): void {
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

  private _setFocused(focused: boolean): void {
    if (focused) {
      this.setAttribute('focused', '');
    } else {
      this.removeAttribute('focused');
    }

    if (focused && this._tabPressed) {
      this.setAttribute('focus-ring', '');
    } else {
      this.removeAttribute('focus-ring');
    }
  }

  private _onToggleClick(): void {
    this.opened = !this.opened;
  }

  private _onToggleKeyDown(e: KeyboardEvent): void {
    if ([13, 32].indexOf(e.keyCode) > -1) {
      e.preventDefault();
      this.opened = !this.opened;
    }
  }

  private _onBodyKeydown(e: KeyboardEvent): void {
    this._tabPressed = e.keyCode === 9;
  }

  private _onBodyKeyup(): void {
    this._tabPressed = false;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'expansion-panel': ExpansionPanel;
  }
}
