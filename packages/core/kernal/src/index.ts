import { Application } from './application/Application';

// @ts-ignore
window.__CONSOLE_OS_GLOBAL_VARS_ = {};

export { 
  mountApp, 
  isAppRegistered, 
  start, 
  createMicroApp,
  unmount,
  mount,
  load,
  destroy,
  update,
  getExposedModule,
  loadExposedModule,
} from './mount';

export { createEventBus } from './application/createEventBus';

export { prefetch } from './prefetch';

export { SandBoxOption, AppInfo } from './type';

export type OSApplication = Application;
