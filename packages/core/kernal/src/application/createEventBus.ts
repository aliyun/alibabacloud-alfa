import { EventEmitter } from '@alicloud/console-os-events';

const eventBus = new EventEmitter();

export const createEventBus = () => {
  return eventBus;
}