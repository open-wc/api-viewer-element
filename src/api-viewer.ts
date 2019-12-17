import { customElement } from 'lit-element';
import { ApiViewerBase } from './api-viewer-base.js';
import styles from './api-viewer-styles.js';

@customElement('api-viewer')
export class ApiViewer extends ApiViewerBase {
  static get styles() {
    return styles;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'api-viewer': ApiViewer;
  }
}
