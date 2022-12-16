import type { ReactiveController, ReactiveControllerHost } from 'lit';

export type AbstractControllerHost = HTMLElement & ReactiveControllerHost;

export class AbstractController<T> {
  host: AbstractControllerHost;

  el: HTMLElement;

  private _data: T[] = [];

  get data(): T[] {
    return this._data;
  }

  set data(data: T[]) {
    this._data = data;

    this.updateData(data);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  updateData(_data: T[]) {
    if (this.host.isConnected) {
      this.host.requestUpdate();
    }
  }

  constructor(host: AbstractControllerHost, component: HTMLElement) {
    (this.host = host).addController(this as ReactiveController);
    this.el = component;
  }

  clear() {
    this.data = [];
  }

  destroy() {
    this.host.removeController(this as ReactiveController);
  }
}
