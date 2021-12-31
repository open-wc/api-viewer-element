import { LitElement, html, css, TemplateResult } from 'lit';
import { ApiViewerTab } from './api-viewer-tab.js';
import type { ApiViewerPanel } from './api-viewer-panel.js';
import './api-viewer-panel.js';

const KEYCODE = {
  DOWN: 40,
  LEFT: 37,
  RIGHT: 39,
  UP: 38,
  HOME: 36,
  END: 35
};

export class ApiViewerTabs extends LitElement {
  private _boundSlotChange = this._onSlotChange.bind(this);

  static get styles() {
    return css`
      :host {
        display: flex;
        border-bottom-left-radius: var(--ave-border-radius);
        overflow: hidden;
      }

      .tabs {
        display: block;
      }

      @media (max-width: 600px) {
        :host {
          flex-direction: column;
        }

        .tabs {
          flex-grow: 1;
          display: flex;
          align-self: stretch;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
        }
      }
    `;
  }

  render(): TemplateResult {
    return html`
      <div class="tabs">
        <slot name="tab"></slot>
      </div>
      <slot name="panel"></slot>
    `;
  }

  firstUpdated(): void {
    this.setAttribute('role', 'tablist');

    this.addEventListener('keydown', this._onKeyDown);
    this.addEventListener('click', this._onClick);

    const [tabSlot, panelSlot] = Array.from(
      this.renderRoot.querySelectorAll('slot')
    );

    if (tabSlot && panelSlot) {
      tabSlot.addEventListener('slotchange', this._boundSlotChange);
      panelSlot.addEventListener('slotchange', this._boundSlotChange);
    }

    Promise.all(
      [...this._allTabs(), ...this._allPanels()].map((el) => el.updateComplete)
    ).then(() => {
      this._linkPanels();
    });
  }

  private _onSlotChange(): void {
    this._linkPanels();
  }

  private _linkPanels(): void {
    const tabs = this._allTabs();
    tabs.forEach((tab) => {
      const panel = tab.nextElementSibling as ApiViewerPanel;
      tab.setAttribute('aria-controls', panel.id);
      panel.setAttribute('aria-labelledby', tab.id);
    });

    const selectedTab = tabs.find((tab) => tab.selected) || tabs[0];

    this._selectTab(selectedTab);
  }

  private _allPanels(): ApiViewerPanel[] {
    return Array.from(this.querySelectorAll('api-viewer-panel'));
  }

  private _allTabs(): ApiViewerTab[] {
    return Array.from(this.querySelectorAll('api-viewer-tab'));
  }

  private _getAvailableIndex(idx: number, increment: number): number {
    const tabs = this._allTabs();
    const total = tabs.length;
    for (
      let i = 0;
      typeof idx === 'number' && i < total;
      i++, idx += increment || 1
    ) {
      if (idx < 0) {
        idx = total - 1;
      } else if (idx >= total) {
        idx = 0;
      }
      const tab = tabs[idx];
      if (!tab.hasAttribute('hidden')) {
        return idx;
      }
    }
    return -1;
  }

  private _panelForTab(tab: ApiViewerTab): ApiViewerPanel | null {
    const panelId = tab.getAttribute('aria-controls');
    return this.querySelector(`#${panelId}`);
  }

  private _prevTab(): ApiViewerTab {
    const tabs = this._allTabs();
    const newIdx = this._getAvailableIndex(
      tabs.findIndex((tab) => tab.selected) - 1,
      -1
    );
    return tabs[(newIdx + tabs.length) % tabs.length];
  }

  private _firstTab(): ApiViewerTab {
    const tabs = this._allTabs();
    return tabs[0];
  }

  private _lastTab(): ApiViewerTab {
    const tabs = this._allTabs();
    return tabs[tabs.length - 1];
  }

  private _nextTab(): ApiViewerTab {
    const tabs = this._allTabs();
    const newIdx = this._getAvailableIndex(
      tabs.findIndex((tab) => tab.selected) + 1,
      1
    );
    return tabs[newIdx % tabs.length];
  }

  /**
   * `reset()` marks all tabs as deselected and hides all the panels.
   */
  public reset(): void {
    const tabs = this._allTabs();
    const panels = this._allPanels();

    tabs.forEach((tab) => {
      tab.selected = false;
    });

    panels.forEach((panel) => {
      panel.hidden = true;
    });
  }

  /**
   * `selectFirst()` automatically selects first non-hidden tab.
   */
  public selectFirst(): void {
    const tabs = this._allTabs();
    const idx = this._getAvailableIndex(0, 1);
    this._selectTab(tabs[idx % tabs.length]);
  }

  private _selectTab(newTab: ApiViewerTab): void {
    this.reset();

    const newPanel = this._panelForTab(newTab);
    if (newPanel) {
      newTab.selected = true;
      newPanel.hidden = false;
    }
  }

  private _onKeyDown(event: KeyboardEvent): void {
    const { target } = event;
    if ((target && target instanceof ApiViewerTab) === false) {
      return;
    }

    if (event.altKey) {
      return;
    }

    let newTab;
    switch (event.keyCode) {
      case KEYCODE.LEFT:
      case KEYCODE.UP:
        newTab = this._prevTab();
        break;
      case KEYCODE.RIGHT:
      case KEYCODE.DOWN:
        newTab = this._nextTab();
        break;
      case KEYCODE.HOME:
        newTab = this._firstTab();
        break;
      case KEYCODE.END:
        newTab = this._lastTab();
        break;
      default:
        return;
    }

    event.preventDefault();
    this._selectTab(newTab);
    newTab.focus();
  }

  private _onClick(event: MouseEvent): void {
    const { target } = event;
    if (target && target instanceof ApiViewerTab) {
      this._selectTab(target);
      target.focus();
    }
  }
}

customElements.define('api-viewer-tabs', ApiViewerTabs);

declare global {
  interface HTMLElementTagNameMap {
    'api-viewer-tabs': ApiViewerTabs;
  }
}
