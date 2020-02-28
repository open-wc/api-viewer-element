import { LitElement, html, css, customElement, property } from 'lit-element';

const format = (
  value: number,
  currency: string | null | undefined,
  locale: string | null | undefined
) => {
  if (!currency || !locale) {
    return '';
  }
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency
  }).format(value);
};

/**
 * A custom element that formats currency using Intl.
 *
 * @element intl-currency
 */
@customElement('intl-currency')
export class IntlCurrency extends LitElement {
  /**
   * Amount to be formatted.
   */
  @property({ type: Number }) value = 0;

  /**
   * Currency code used for formatting.
   */
  @property({ type: String }) currency: string | null | undefined = 'EUR';

  /**
   * Locale code used for formatting.
   */
  @property({ type: String }) locale: string | null | undefined = 'en-GB';

  static get styles() {
    return css`
      :host {
        all: inherit;
        display: inline-block;
      }
    `;
  }

  protected render() {
    return html`
      <div part="value">
        ${format(this.value, this.currency, this.locale)}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'intl-currency': IntlCurrency;
  }
}
