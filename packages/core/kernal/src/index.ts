import { triggerAppChange,  unloadApplication, toggleNavigationCalling } from 'os-single-spa';
import { Application } from './application/Application';
import { createEventBus } from './application/createEventBus';

// @ts-ignore
window.__CONSOLE_OS_GLOBAL_VARS_ = {};

export { mountApp, isAppRegistered, start, createMicroApp, unmount, mount, load, distroy, getExposedModule, loadExposedModule, update } from './mount';

export { triggerAppChange, unloadApplication, createEventBus, toggleNavigationCalling }

export { prefetch } from './prefetch';

export { SandBoxOption } from './type';
export type OSApplication = Application;
