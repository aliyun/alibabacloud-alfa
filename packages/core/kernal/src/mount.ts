import { start as startSpa, toggleNavigationCalling, getAppNames } from 'os-single-spa';
import { AppInfo, AppOption, GlobalOption } from './type';
import { createApplication } from './application/createApp';
import { createCachePool } from './application/AppCachePool';
import * as ManifestCachePool from './misc/ManifestCachePool';

let globalOptions: GlobalOption = {};

export const mountApp = async (appInfo: AppInfo, options: AppOption = {}) => {
  // process the options
  const sandBox = {
    singleton: true,
    ...globalOptions.sandBox,
    ...options.sandBox,
  };

  if (!appInfo.deps) {
    appInfo.deps = globalOptions.deps || {};
  }

  // create application
  const app = await createApplication(appInfo, sandBox);
  // load application
  await app.load();
  // mount application
  await app.mount(appInfo);

  return app;
}

export const isAppRegistered = (appName: string) => {
  return getAppNames().indexOf(appName) !== -1;
}

export const start = (options?: GlobalOption) => {
  globalOptions = options || {};
  // @ts-ignore
  toggleNavigationCalling(true);
  startSpa();
  createCachePool({});
  ManifestCachePool.createCachePool();
}
