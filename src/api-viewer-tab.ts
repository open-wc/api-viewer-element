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
      }

      :host([hidden]) {
        display: none !important;
      }
    `;
  }

  render() {
    return html`
      ${this.heading}
    `;
  }

  firstUpdated() {
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

  updated(props: PropertyValues) {
    super.updated(props);

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
