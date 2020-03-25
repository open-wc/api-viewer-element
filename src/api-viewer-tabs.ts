import { LitElement, html, customElement, css } from 'lit-element';
import { ApiViewerTab } from './api-viewer-tab.js';
import { ApiViewerPanel } from './api-viewer-panel.js';

const KEYCODE = {
  DOWN: 40,
  LEFT: 37,
  RIGHT: 39,
  UP: 38,
  HOME: 36,
  END: 35
};

@customElement('api-viewer-tabs')
export class ApiViewerTabs extends LitElement {
  private _boundSlotChange = this._onSlotChange.bind(this);

  static get styles() {
    return css`
      :host {
        display: flex;
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

  render() {
    return html`
      <div class="tabs">
        <slot name="tab"></slot>
      </div>
      <slot name="panel"></slot>
    `;
  }

  firstUpdated() {
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

  private _onSlotChange() {
    this._linkPanels();
  }

  private _linkPanels() {
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

  private _getAvailableIndex(idx: number, increment: number) {
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

  private _prevTab() {
    const tabs = this._allTabs();
    const newIdx = this._getAvailableIndex(
      tabs.findIndex((tab) => tab.selected) - 1,
      -1
    );
    return tabs[(newIdx + tabs.length) % tabs.length];
  }

  private _firstTab() {
    const tabs = this._allTabs();
    return tabs[0];
  }

  private _lastTab() {
    const tabs = this._allTabs();
    return tabs[tabs.length - 1];
  }

  private _nextTab() {
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
  public reset() {
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
  public selectFirst() {
    const tabs = this._allTabs();
    const idx = this._getAvailableIndex(0, 1);
    this._selectTab(tabs[idx % tabs.length]);
  }

  private _selectTab(newTab: ApiViewerTab) {
    this.reset();

    const newPanel = this._panelForTab(newTab);
    if (!newPanel) {
      throw new Error('No panel with for tab');
    }
    newTab.selected = true;
    newPanel.hidden = false;
  }

  private _onKeyDown(event: KeyboardEvent) {
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

  private _onClick(event: MouseEvent) {
    const { target } = event;
    if (target && target instanceof ApiViewerTab) {
      this._selectTab(target);
      target.focus();
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'api-viewer-tabs': ApiViewerTabs;
  }
}
