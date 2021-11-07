import { ReactiveController, ReactiveControllerHost } from 'lit';
import { EventInfo } from '../lib/types.js';
import { HasKnobs } from '../api-demo-knobs-mixin.js';

type EventsHost = HTMLElement & ReactiveControllerHost & HasKnobs;

export class EventsController implements ReactiveController {
  host: EventsHost;

  private _log: CustomEvent[] = [];

  get log(): CustomEvent[] {
    return this._log;
  }

  set log(log: CustomEvent[]) {
    this._log = log;

    if (this.host.isConnected) {
      this.host.requestUpdate();
    }
  }

  constructor(
    host: ReactiveControllerHost,
    component: HTMLElement,
    events: EventInfo[]
  ) {
    (this.host = host as EventsHost).addController(this);

    events.forEach((event) => {
      component.addEventListener(event.name, ((evt: CustomEvent) => {
        const s = '-changed';
        if (event.name.endsWith(s)) {
          const { knob } = this.host.getKnob(event.name.replace(s, ''));
          if (knob) {
            this.host.syncKnob(component, knob);
          }
        }

        this.log = [...this.log, evt];
      }) as EventListener);
    });
  }

  clear() {
    this.log = [];
  }

  hostDisconnected() {
    this.clear();
  }
}
