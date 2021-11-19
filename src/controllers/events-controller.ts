import { ReactiveController, ReactiveControllerHost } from 'lit';
import { Event } from '../lib/manifest.js';
import { HasKnobs } from '../lib/knobs.js';

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
    events: Event[]
  ) {
    (this.host = host as EventsHost).addController(this);

    events.forEach(({ name }) => {
      component.addEventListener(name, ((evt: CustomEvent) => {
        const s = '-changed';
        if (name.endsWith(s)) {
          const { knob } = this.host.getKnob(name.replace(s, ''));
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
