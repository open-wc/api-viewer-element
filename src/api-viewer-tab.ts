import {
  LitElement,
  html,
  customElement,
  css,
  property,
  PropertyValues,
  TemplateResult
} from 'lit-element';

let tabIdCounter = 0;

@customElement('api-viewer-tab')
export class ApiViewerTab extends LitElement {
  @property({ type: Boolean, reflect: true }) selected = false;

  @property() heading = '';

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
        display: block;
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        width: var(--ave-tab-indicator-size);
        background-color: var(--ave-primary-color);
        opacity: 0;
      }

      :host([selected]) {
        color: var(--ave-primary-color);
      }

      :host([selected])::before {
        opacity: 1;
      }

      :host::after {
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

      :host(:hover)::after {
        opacity: 0.08;
      }

      :host([focus-ring])::after {
        opacity: 0.12;
      }

      :host([active])::after {
        opacity: 0.16;
      }

      @media (max-width: 600px) {
        :host {
          justify-content: center;
          text-align: center;
        }

        :host::before {
          top: auto;
          right: 0;
          width: 100%;
          height: var(--ave-tab-indicator-size);
        }
      }
    `;
  }

  protected render(): TemplateResult {
    return html`${this.heading}`;
  }

  protected firstUpdated() {
    this.setAttribute('role', 'tab');

    if (!this.id) {
      this.id = `api-viewer-tab-${tabIdCounter++}`;
    }

    this.addEventListener('focus', () => this._setFocused(true), true);
    this.addEventListener(
      'blur',
      () => {
        this._setFocused(false);
        this._setActive(false);
      },
      true
    );

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
    this.toggleAttribute('active', active);
  }

  private _setFocused(focused: boolean) {
    this.toggleAttribute('focused', focused);
    this.toggleAttribute('focus-ring', focused && !this._mousedown);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'api-viewer-tab': ApiViewerTab;
  }
}
