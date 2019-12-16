import {
  LitElement,
  html,
  customElement,
  css,
  property,
  PropertyValues
} from 'lit-element';

let tabIdCounter = 0;

@customElement('api-viewer-tab')
export class ApiViewerTab extends LitElement {
  @property({ type: Boolean, reflect: true }) selected = false;

  @property({ type: String }) heading = '';

  @property({ type: Boolean }) active = false;

  private _mousedown = false;

  static get styles() {
    return css`
      :host {
        display: flex;
        align-items: center;
        flex-shrink: 0;
        box-sizing: border-box;
        position: relative;
        max-width: 150px;
        overflow: hidden;
        min-height: 3rem;
        padding: 0 1rem;
        color: var(--ave-tab-color);
        font-size: 0.875rem;
        line-height: 1.2;
        font-weight: 500;
        text-transform: uppercase;
        transition: box-shadow 0.3s;
        outline: none;
        cursor: pointer;
        -webkit-user-select: none;
        user-select: none;
        -webkit-tap-highlight-color: transparent;
      }

      :host([hidden]) {
        display: none !important;
      }

      :host::before {
        content: '';
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        background-color: var(--ave-primary-color);
        opacity: 0;
        transition: opacity 0.1s linear;
      }

      :host(:hover)::before {
        opacity: 0.04;
      }

      :host([focus-ring])::before {
        opacity: 0.1;
      }

      :host([selected]) {
        color: var(--ave-primary-color);
        box-shadow: inset 2px 0 0 0 var(--ave-primary-color);
      }

      :host::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 100px;
        height: 100px;
        border-radius: 50%;
        transform: translate(-50%, -50%) scale(0);
        background-color: var(--ave-primary-color);
        opacity: 0;
        transition: transform 0s cubic-bezier(0.05, 0.8, 0.5, 1),
          opacity 0s linear;
      }

      :host([focused]:not([focus-ring]))::after,
      :host([focused][active])::after,
      :host([focus-ring][selected])::after {
        transform: translate(-50%, -50%) scale(3);
        opacity: 0;
        transition-duration: 2s, 0.6s;
      }

      :host([active]:not([selected]))::after {
        opacity: 0.2;
        transition-duration: 2s, 0s;
      }

      @media (pointer: coarse) {
        :host(:hover)::before {
          display: none;
        }
      }

      @media (max-width: 600px) {
        :host {
          justify-content: center;
          text-align: center;
        }

        :host([selected]) {
          box-shadow: inset 0 -2px 0 0 var(--ave-primary-color);
        }
      }
    `;
  }

  protected render() {
    return html`
      ${this.heading}
    `;
  }

  protected firstUpdated() {
    this.setAttribute('role', 'tab');

    if (!this.id) {
      this.id = `api-viewer-tab-${tabIdCounter++}`;
    }

    this.addEventListener('focus', () => this._setFocused(true), true);
    this.addEventListener('blur', () => this._setFocused(false), true);

    this.addEventListener('mousedown', () => {
      this._setActive((this._mousedown = true));
      const mouseUpListener = () => {
        this._setActive((this._mousedown = false));
        document.removeEventListener('mouseup', mouseUpListener);
      };
      document.addEventListener('mouseup', mouseUpListener);
    });
  }

  protected updated(props: PropertyValues) {
    if (props.has('selected')) {
      this.setAttribute('aria-selected', String(this.selected));
      this.setAttribute('tabindex', this.selected ? '0' : '-1');
    }
  }

  private _setActive(active: boolean) {
    if (active) {
      this.setAttribute('active', '');
    } else {
      this.removeAttribute('active');
    }
  }

  private _setFocused(focused: boolean) {
    if (focused) {
      this.setAttribute('focused', '');
      if (!this._mousedown) {
        this.setAttribute('focus-ring', '');
      }
    } else {
      this.removeAttribute('focused');
      this.removeAttribute('focus-ring');
      this._setActive(false);
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'api-viewer-tab': ApiViewerTab;
  }
}
