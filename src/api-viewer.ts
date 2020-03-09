import { customElement } from 'lit-element';
import { ApiViewerBase } from './api-viewer-base.js';
import { setTemplates } from './lib/utils.js';
import styles from './api-viewer-styles.js';

@customElement('api-viewer')
export class ApiViewer extends ApiViewerBase {
  static get styles() {
    return styles;
  }

  protected firstUpdated() {
    this.setTemplates();
  }

  public setTemplates(templates?: HTMLTemplateElement[]) {
    setTemplates(
      this._id as number,
      templates || Array.from(this.querySelectorAll('template'))
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'api-viewer': ApiViewer;
  }
}
