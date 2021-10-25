import { css } from 'lit';
import { ApiDocsBase } from './api-docs-base.js';
import docsStyles from './api-docs-styles.js';
import sharedStyles from './shared-styles.js';

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

customElements.define('api-docs', ApiDocs);

declare global {
  interface HTMLElementTagNameMap {
    'api-docs': ApiDocs;
  }
}
