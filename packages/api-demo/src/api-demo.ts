import sharedStyles from '@api-viewer/common/lib/shared-styles.js';
import { setTemplates } from '@api-viewer/common/lib/templates.js';
import { ApiDemoBase } from './base.js';
import demoStyles from './styles.js';

export class ApiDemo extends ApiDemoBase {
  static get styles() {
    return [sharedStyles, demoStyles];
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
