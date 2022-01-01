import { Event } from '@api-viewer/common/lib/manifest.js';
import {
  AbstractController,
  AbstractControllerHost
} from './abstract-controller.js';
import { HasKnobs } from '../types.js';

export class EventsController extends AbstractController<CustomEvent> {
  constructor(
    host: AbstractControllerHost & HasKnobs,
    component: HTMLElement,
    events: Event[]
  ) {
    super(host, component);

    events.forEach(({ name }) => {
      component.addEventListener(name, ((evt: CustomEvent) => {
        const s = '-changed';
        if (name.endsWith(s)) {
          const { knob } = host.getKnob(name.replace(s, ''));
          if (knob) {
            host.syncKnob(component, knob);
          }
        }

        this.data = [...this.data, evt];
      }) as EventListener);
    });
  }
}
