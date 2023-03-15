import { start as startSpa, getAppNames } from 'os-single-spa';
import { AppInfo, AppOption, GlobalOption } from './type';
import { createApplication } from './application/createApp';
import { createCachePool } from './application/AppCachePool';
import * as ManifestCachePool from './misc/ManifestCachePool';
import { Application } from './application/Application';

export let globalOptions: GlobalOption = {};

export let isStart = false;

/**
 * Create a Micro Application instance
 * @param appInfo
 * @param options
 */
export const createMicroApp = async (appInfo: AppInfo, options: AppOption = {}) => {
  if (!isStart) {
    start();
  }
  // process the options
  const sandBox = {
    singleton: true,
    ...globalOptions.sandbox,
    ...options.sandbox,
  };

  if (!appInfo.deps) {
    appInfo.deps = globalOptions.deps || {};
  }

  return await createApplication(appInfo, sandBox);
};

/**
 * Load app assets instance according to its manifest,
 * @param appInfo
 * @param options
 */
export const load = async (app: Application) => {
  await app.load();
  return app;
};

/**
 * Mount app to a dom
 * @param app
 * @param mountInfo
 */
export const mount = async (app: Application, mountInfo: AppInfo) => {
  await app.mount(mountInfo.dom, { customProps: mountInfo.customProps });
  return app;
};

/**
 * update the props to application
 * @param app
 * @param props
 */
export const update = async (app: Application, props: any) => {
  await app.update(props);
};

/**
 * mount a app
 * @param app
 */
export const unmount = async (app: Application) => {
  await app.unmount();
  return app;
};

export const destroy = async (app: Application) => {
  await app.destroy();
  return app;
};

export const getExposedModule = <T>(app: Application, moduleName: string) => {
  return app.getExposedModule<T>(moduleName);
};

export const loadExposedModule = async <T>(appInfo: AppInfo, moduleName: string, options: AppOption = {}) => {
  // create application
  const app = await createMicroApp(appInfo, options);
  // load application
  await load(app);

  return getExposedModule<T>(app, moduleName);
};

/**
 *
 * @param appInfo
 * @param options
 */
export const mountApp = async (appInfo: AppInfo, options: AppOption = {}) => {
  // create application
  const app = await createMicroApp(appInfo, options);
  // load application
  await load(app);
  // mount application
  await mount(app, appInfo);

  return app;
};

export const isAppRegistered = (appName: string) => {
  return getAppNames().indexOf(appName) !== -1;
};

/**
 * Start consoleos instance
 * @param options
 */
export const start = (options?: GlobalOption) => {
  isStart = true;
  globalOptions = options || {};
  // @ts-ignore
  // toggleNavigationCalling(true);
  startSpa();
  createCachePool({});
  ManifestCachePool.createCachePool();
};

start();
