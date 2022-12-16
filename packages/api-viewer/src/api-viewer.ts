import type { CSSResultArray } from 'lit';
import { setTemplates } from '@api-viewer/common/lib/templates.js';
import { ApiViewerBase } from './base.js';
import styles from './styles.js';

export class ApiViewer extends ApiViewerBase {
  static get styles(): CSSResultArray {
    return styles;
  }

  protected firstUpdated(): void {
    this.setTemplates();
  }

  public setTemplates(templates?: HTMLTemplateElement[]): void {
    setTemplates(
      this._id!,
      templates || Array.from(this.querySelectorAll('template'))
    );
  }
}

customElements.define('api-viewer', ApiViewer);

declare global {
  interface HTMLElementTagNameMap {
    'api-viewer': ApiViewer;
  }
}
