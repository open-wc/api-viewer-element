import { css } from 'lit';
import { ApiDemoBase } from './api-demo-base.js';
import { setTemplates } from './lib/utils.js';
import demoStyles from './api-demo-styles.js';
import sharedStyles from './shared-styles.js';

export class ApiDemo extends ApiDemoBase {
  static get styles() {
    return [
      sharedStyles,
      demoStyles,
      css`
        api-demo-content {
          display: block;
        }
      `
    ];
  }

  protected firstUpdated(): void {
    this.setTemplates();
  }

  public setTemplates(templates?: HTMLTemplateElement[]): void {
    setTemplates(
      this._id as number,
      templates || Array.from(this.querySelectorAll('template'))
    );
  }
}

customElements.define('api-demo', ApiDemo);

declare global {
  interface HTMLElementTagNameMap {
    'api-demo': ApiDemo;
  }
}
