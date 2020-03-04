import { customElement, css } from 'lit-element';
import { ApiDocsBase } from './api-docs-base.js';
import docsStyles from './api-docs-styles.js';
import sharedStyles from './shared-styles.js';

@customElement('api-docs')
export class ApiDocs extends ApiDocsBase {
  static get styles() {
    return [
      sharedStyles,
      docsStyles,
      css`
        api-docs-content {
          display: block;
        }
      `
    ];
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'api-docs': ApiDocs;
  }
}
