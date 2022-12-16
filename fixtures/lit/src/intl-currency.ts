import {
  css,
  html,
  LitElement,
  type CSSResult,
  type TemplateResult
} from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import { property } from 'lit/decorators/property.js';

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
  @property() currency: string | null | undefined = 'EUR';

  /**
   * Locale code used for formatting.
   */
  @property() locale: string | null | undefined = 'en-GB';

  static get styles(): CSSResult {
    return css`
      :host {
        all: inherit;
        display: inline-block;
      }

      div {
        text-decoration: inherit;
      }
    `;
  }

  protected render(): TemplateResult {
    return html`
      <div part="value">${format(this.value, this.currency, this.locale)}</div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'intl-currency': IntlCurrency;
  }
}
