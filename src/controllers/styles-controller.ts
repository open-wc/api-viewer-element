import { ReactiveController, ReactiveControllerHost } from 'lit';
import { CSSPropertyInfo } from '../lib/types.js';
import { unquote } from '../lib/utils.js';

export class StylesController implements ReactiveController {
  host: HTMLElement & ReactiveControllerHost;

  el: HTMLElement;

  private _css: CSSPropertyInfo[] = [];

  get css(): CSSPropertyInfo[] {
    return this._css;
  }

  set css(cssProps: CSSPropertyInfo[]) {
    this._css = cssProps;

    if (cssProps.length) {
      cssProps.forEach((prop) => {
        const { name, value } = prop;
        if (value) {
          if (value === prop.default) {
            this.el.style.removeProperty(name);
          } else {
            this.el.style.setProperty(name, value);
          }
        }
      });
    }

    // Update the demo snippet
    if (this.host.isConnected) {
      this.host.requestUpdate();
    }
  }

  constructor(
    host: HTMLElement & ReactiveControllerHost,
    component: HTMLElement,
    cssProps: CSSPropertyInfo[]
  ) {
    (this.host = host).addController(this);
    this.el = component;

    if (cssProps.length) {
      const style = getComputedStyle(component);

      this.css = cssProps.map((cssProp) => {
        let value = cssProp.default
          ? unquote(cssProp.default)
          : style.getPropertyValue(cssProp.name);

        const result = cssProp;
        if (value) {
          value = value.trim();
          result.default = value;
          result.value = value;
        }

        return result;
      });
    }
  }

  hostDisconnected() {
    this.css = [];
  }

  setValue(name: string, value: string) {
    this.css = this.css.map((prop) => {
      return prop.name === name
        ? {
            ...prop,
            value
          }
        : prop;
    });
  }
}
