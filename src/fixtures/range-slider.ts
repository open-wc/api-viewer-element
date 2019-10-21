import {
  LitElement,
  html,
  css,
  customElement,
  property,
  PropertyValues
} from 'lit-element';
import { ifDefined } from 'lit-html/directives/if-defined.js';

/**
 * A custom element wrapping `<input type="range">`.
 *
 * @element range-slider
 *
 * @fires change - Event fired when value change is committed
 * @fires value-changed - Event fired when value is changed by the user
 */
@customElement('range-slider')
export class RangeElement extends LitElement {
  /**
   * Disabled element can not be clicked
   */
  @property({ type: Boolean, reflect: true }) disabled = false;

  /**
   * Value set on the wrapped `<input>` element.
   *
   * @memberof RangeElement
   */
  @property({ type: Number }) value = 0;

  /**
   * The minimum permitted value.
   */
  @property({ type: Number }) min = 0;

  /**
   * The maximum permitted value.
   */
  @property({ type: Number }) max = 0;

  /**
   * The stepping interval.
   */
  @property({ type: Number }) step = 1;

  static get styles() {
    return css`
      :host {
        display: block;
      }
    `;
  }

  render() {
    return html`
      <input
        type="range"
        class="range"
        .value="${this.value.toString()}"
        min="${ifDefined(this.min)}"
        max="${ifDefined(this.max)}"
        step="${ifDefined(this.step)}"
        ?disabled="${this.disabled}"
        aria-valuemin="${ifDefined(this.min)}"
        aria-valuemax="${ifDefined(this.max)}"
        aria-valuenow="${this.value}"
        @input="${this._onInput}"
        @change="${this._onChange}"
      />
    `;
  }

  update(props: PropertyValues) {
    if (props.has('value')) {
      if (!isNaN(this.value)) {
        if (!isNaN(this.min) && this.value < this.min) {
          this.value = this.min;
        } else if (!isNaN(this.max) && this.value > this.max) {
          this.value = this.max;
        }
      } else {
        this.value = (this.max - this.min) / 2 + this.min;
      }
    }

    if (props.has('min')) {
      if (isNaN(this.min)) {
        this.min = 0;
      }
    }

    if (props.has('max')) {
      if (isNaN(this.max)) {
        this.max = 100;
      }
    }

    if (props.has('step')) {
      if (isNaN(this.step)) {
        this.step = 1;
      }
    }

    super.update(props);
  }

  updated(props: PropertyValues) {
    super.updated(props);

    if (props.has('value')) {
      this.dispatchEvent(
        new CustomEvent('value-changed', {
          detail: {
            value: this.value
          }
        })
      );
    }
  }

  _onChange(e: Event) {
    // In the Shadow DOM, the `change` event is not leaked
    // into the ancestor tree, so we must do this manually.
    const changeEvent = new CustomEvent('change', {
      detail: {
        sourceEvent: e
      },
      bubbles: e.bubbles,
      cancelable: e.cancelable
    });
    this.dispatchEvent(changeEvent);
  }

  _onInput(e: Event) {
    this.value = Number((e.target as HTMLInputElement).value);
  }
}
