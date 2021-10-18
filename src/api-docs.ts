import { customElement, css } from 'lit';
import { ApiDocsBase } from './api-docs-base.js';
import docsStyles from './api-docs-styles.js';
import sharedStyles from './shared-styles.js';

@customElement('api-docs')
export class ApiDocs extends ApiDocsBase {
  static readonly styles = [
    sharedStyles,
    docsStyles,
    css`
      api-docs-content {
        display: block;
      }
    `
  ];
}

declare global {
  interface HTMLElementTagNameMap {
    'api-docs': ApiDocs;
  }
}
