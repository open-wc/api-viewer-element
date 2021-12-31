import sharedStyles from '@api-viewer/common/lib/shared-styles.js';
import { ApiDocsBase } from './base.js';
import docsStyles from './styles.js';

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
