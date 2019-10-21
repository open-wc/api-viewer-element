import {
  LitElement,
  html,
  css,
  customElement,
  property,
  query,
  PropertyValues
} from 'lit-element';

/**
 * A custom element wrapping `<input>` with `<label>` and extra slots.
 *
 * @element input-wrapper
 *
 * @fires change - Event fired on value change (blur)
 * @fires input - Event fired on user input (key)
 *
 * @slot prefix - Slot for prefix content
 * @slot suffix - Slot for suffix content
 * @slot helper - Slot for helper content
 *
 * @attr {boolean} has-value - State attribute set when element has value
 * @attr {boolean} has-label - State attribute set when element has label
 */
@customElement('input-wrapper')
class InputWrapper extends LitElement {
  /**
   * Disabled element can not be clicked
   */
  @property({ type: Boolean, reflect: true }) disabled = false;

  /**
   * Text content to show in the `<label>` element.
   */
  @property({ type: String }) label?: string | undefined;

  /**
   * Value to set on the wrapped `<input>` element.
   */
  @property({ type: String }) value = '';

  /**
   * Helper text to show below the input.
   */
  @property({ type: String }) helper = '';

  /**
   * Reference to the native input.
   *
   * @protected
   */
  @query('input')
  protected inputElement?: HTMLInputElement;

  static get styles() {
    return css`
      :host {
        display: inline-block;
      }

      :host([hidden]) {
        display: none !important;
      }
    `;
  }

  render() {
    return html`
      <label part="label" @click="${this.focus}">${this.label}</label>

      <div part="input-field">
        <slot name="prefix"></slot>

        <input
          part="value"
          .value="${this.value}"
          @input="${this._onInput}"
          @change="${this._onChange}"
        />

        <slot name="suffix"></slot>
      </div>

      <div part="helper" @click="${this.focus}">
        <slot name="helper">${this.helper}</slot>
      </div>
    `;
  }

  protected updated(props: PropertyValues) {
    super.updated(props);

    if (props.has('label')) {
      if (this.label) {
        this.setAttribute('has-label', '');
      } else if (props.get('label')) {
        this.removeAttribute('has-label');
      }
    }

    if (props.has('value')) {
      if (this.value) {
        this.setAttribute('has-value', '');
      } else if (props.get('value')) {
        this.removeAttribute('has-value');
      }
    }
  }

  protected _onInput() {
    this.dispatchEvent(
      new CustomEvent('input', {
        bubbles: true
      })
    );
  }

  protected _onChange() {
    this.dispatchEvent(
      new CustomEvent('change', {
        bubbles: true
      })
    );
  }

  focus() {
    if (this.inputElement) {
      this.inputElement.focus();
    }
  }
}

export { InputWrapper };

declare global {
  interface HTMLElementTagNameMap {
    'input-wrapper': InputWrapper;
  }
}
