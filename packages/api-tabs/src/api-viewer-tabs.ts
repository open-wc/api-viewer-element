import { html } from '@api-viewer/common/lib/utils.js';
import { ApiViewerTab } from './api-viewer-tab.js';
import type { ApiViewerPanel } from './api-viewer-panel.js';
import './api-viewer-panel.js';

const tpl = html`
  <style>
    :host {
      display: flex;
      border-bottom-left-radius: var(--ave-border-radius);
      overflow: hidden;
    }

    @media (max-width: 600px) {
      :host {
        flex-direction: column;
      }

      .tabs {
        display: flex;
        flex-grow: 1;
        align-self: stretch;
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
      }
    }
  </style>
  <div class="tabs">
    <slot name="tab"></slot>
  </div>
  <slot name="panel"></slot>
`;

export class ApiViewerTabs extends HTMLElement {
  constructor() {
    super();

    const root = this.attachShadow({ mode: 'open' });
    root.appendChild(tpl.content.cloneNode(true));

    const slots = root.querySelectorAll('slot');

    slots[0].addEventListener('slotchange', () => this._linkPanels());
    slots[1].addEventListener('slotchange', () => this._linkPanels());

    this.addEventListener('keydown', this.handleEvent);
    this.addEventListener('click', this.handleEvent);
  }

  connectedCallback(): void {
    this.setAttribute('role', 'tablist');

    requestAnimationFrame(() => {
      this._linkPanels();
    });
  }

  private _linkPanels(): void {
    const { tabs } = this;
    tabs.forEach((tab) => {
      const panel = tab.nextElementSibling as ApiViewerPanel;
      tab.setAttribute('aria-controls', panel.id);
      panel.setAttribute('aria-labelledby', tab.id);
    });

    const selectedTab = tabs.find((tab) => tab.selected) || tabs[0];

    this._selectTab(selectedTab);
  }

  get tabs(): ApiViewerTab[] {
    return Array.from(this.querySelectorAll('api-viewer-tab'));
  }

  private _getAvailableIndex(idx: number, increment: number): number {
    const { tabs } = this;
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

  private _prevTab(tabs: ApiViewerTab[]): ApiViewerTab {
    const newIdx = this._getAvailableIndex(
      tabs.findIndex((tab) => tab.selected) - 1,
      -1
    );
    return tabs[(newIdx + tabs.length) % tabs.length];
  }

  private _nextTab(tabs: ApiViewerTab[]): ApiViewerTab {
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
    this.tabs.forEach((tab) => {
      tab.selected = false;
    });

    this.querySelectorAll('api-viewer-panel').forEach((panel) => {
      panel.hidden = true;
    });
  }

  /**
   * `selectFirst()` automatically selects first non-hidden tab.
   */
  public selectFirst(): void {
    const idx = this._getAvailableIndex(0, 1);
    this._selectTab(this.tabs[idx % this.tabs.length]);
  }

  private _selectTab(newTab: ApiViewerTab): void {
    this.reset();

    const panelId = newTab.getAttribute('aria-controls');
    const newPanel = this.querySelector(`#${panelId}`) as ApiViewerPanel;
    if (newPanel) {
      newTab.selected = true;
      newPanel.hidden = false;
    }
  }

  handleEvent(event: KeyboardEvent | MouseEvent): void {
    const { target } = event;
    if (target && target instanceof ApiViewerTab) {
      let newTab: ApiViewerTab;

      if (event.type === 'keydown') {
        const { tabs } = this;

        switch ((event as KeyboardEvent).key) {
          case 'ArrowLeft':
          case 'ArrowUp':
            newTab = this._prevTab(tabs);
            break;
          case 'ArrowDown':
          case 'ArrowRight':
            newTab = this._nextTab(tabs);
            break;
          case 'Home':
            newTab = tabs[0];
            break;
          case 'End':
            newTab = tabs[tabs.length - 1];
            break;
          default:
            // Return to not prevent default.
            return;
        }

        event.preventDefault();
      } else {
        newTab = target;
      }

      this._selectTab(newTab);
      newTab.focus();
    }
  }
}

customElements.define('api-viewer-tabs', ApiViewerTabs);

declare global {
  interface HTMLElementTagNameMap {
    'api-viewer-tabs': ApiViewerTabs;
  }
}
