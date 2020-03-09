import { customElement, css } from 'lit-element';
import { ApiDemoBase } from './api-demo-base.js';
import demoStyles from './api-demo-styles.js';
import sharedStyles from './shared-styles.js';

@customElement('api-demo')
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
}

declare global {
  interface HTMLElementTagNameMap {
    'api-demo': ApiDemo;
  }
}
