import { EventEmitter  } from '@alicloud/console-os-events';

export const eventBus = new EventEmitter();

export const createEventBus = () => {
  try {
    // @ts-ignore
    return  typeof _aliOSKernel === undefined ? eventBus : ( _aliOSKernel.createEventBus ? _aliOSKernel.createEventBus() : eventBus)
  } catch (e) {}
  return eventBus;
}