import { Application } from './application/Application';

// @ts-ignore
window.__CONSOLE_OS_GLOBAL_VARS_ = {};

import { 
  mountApp as _mountApp, 
  isAppRegistered as _isAppRegistered, 
  start as _start,
  createMicroApp as _createMicroApp,
  unmount as _unmount,
  mount as _mount,
  load as _load,
  destroy as _destroy,
  update as _update,
  getExposedModule as _getExposedModule,
  loadExposedModule as _loadExposedModule,
} from './mount';
export { createEventBus } from './application/createEventBus';
import { prefetch as _prefetch } from './prefetch';

import { wrapSharing } from './sharing';


export const mountApp = wrapSharing(_mountApp, 'mountApp');
export const isAppRegistered = wrapSharing(_mountApp, 'isAppRegistered');
export const start = wrapSharing(_start, 'start');
export const load = wrapSharing(_load, 'load');
export const destroy = wrapSharing(_destroy, 'destroy');
export const update = wrapSharing(_update, 'update');
export const getExposedModule = wrapSharing(_getExposedModule, 'getExposedModule');
export const loadExposedModule = wrapSharing(_loadExposedModule, 'loadExposedModule');
export const mount = wrapSharing(_mount, 'mount');
export const unmount = wrapSharing(_unmount, 'unmount');
export const createMicroApp = wrapSharing(_createMicroApp, 'createMicroApp');
export const prefetch = wrapSharing(_prefetch, 'prefetch');

// Export Type
import { SandBoxOption as ISandBoxOption, AppInfo as IAppInfo } from './type';

export type OSApplication = Application;
export type SandBoxOption = ISandBoxOption;
export type AppInfo = IAppInfo;
