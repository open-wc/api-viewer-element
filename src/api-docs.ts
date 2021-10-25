import { ApiDocsBase } from './api-docs-base.js';
import docsStyles from './styles/docs-styles.js';
import sharedStyles from './styles/shared-styles.js';

export class ApiDocs extends ApiDocsBase {
  static get styles() {
    return [sharedStyles, docsStyles];
  }
}

customElements.define('api-docs', ApiDocs);

declare global {
  interface HTMLElementTagNameMap {
    'api-docs': ApiDocs;
  }
}
