import {
  LitElement,
  html,
  customElement,
  css,
  property,
  query
} from 'lit-element';

@customElement('api-viewer-select')
export class ApiViewerSelect extends LitElement {
  @property({ attribute: false }) options: string[] = [];

  @property({ type: Number }) selected = 0;

  @query('select')
  select?: HTMLSelectElement;

  static get styles() {
    return css`
      :host {
        display: block;
      }

      :host([hidden]) {
        display: none !important;
      }
    `;
  }

  protected render() {
    return html`
      <select @change="${this._onChange}">
        ${this.options.map((option, index) => {
          const selected = this.selected === index;
          return html`
            <option ?selected="${selected}">${option}</option>
          `;
        })}
      </select>
    `;
  }

  private _onChange() {
    this.dispatchEvent(
      new CustomEvent('selected-changed', {
        detail: {
          selected: this.select && this.select.value
        }
      })
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'api-viewer-select': ApiViewerSelect;
  }
}
