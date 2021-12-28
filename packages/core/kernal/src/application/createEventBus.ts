import { EventEmitter } from '@alicloud/console-os-events';

export const eventBus = new EventEmitter();

export const createEventBus = () => {
  const kernel = window._aliOSKernel;

  try {
    if (typeof kernel === 'undefined') {
      return eventBus;
    } else if (kernel.createEventBus) {
      return kernel.createEventBus();
    } else {
      return eventBus;
    }
  } catch (e) {
    // ...
  }

  return eventBus;
};
