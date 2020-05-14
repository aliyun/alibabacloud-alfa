import { start as startSpa, mountRootParcel, toggleNavigationCalling, getAppNames } from 'os-single-spa';
import { AppInfo, AppOption } from './type';
import { flattenFnArray } from './misc/util';
import { createApplication } from './application/createApp';
import { createEventBus } from './application/createEventBus';
import { createCachePool } from 'application/AppCachePool';

let globalOptions: AppOption = {};

export const mountApp = async (appInfo: AppInfo, options: AppOption = {}) => {
  const { id } = appInfo;

  const sandBox = {
    singleton: true,
    ...globalOptions.sandBox,
    ...options.sandBox,
  };

  if (!appInfo.deps) {
    appInfo.deps = globalOptions.deps || {};
  }

  const app = await createApplication(appInfo, sandBox);
  const remoteApp = await app.getAppLoader();

  const parcel = mountRootParcel({
    name: id,
    customProps:{},
    domElement: undefined,
    bootstrap: flattenFnArray(remoteApp.bootstrap, 'bootstrap'),
    mount: flattenFnArray(remoteApp.mount, 'mount'),
    unmount: flattenFnArray(remoteApp.unmount, 'unmount'),
    update: flattenFnArray(remoteApp.update, 'update'),
  }, {
    domElement: appInfo.dom,
    appProps: {
      emitter: createEventBus(),
      ...appInfo.customProps
    }
  });

  app.attachParcel(parcel);

  return app;
}

export const isAppRegistered = (appName: string) => {
  return getAppNames().indexOf(appName) !== -1;
}

export const start = (options?: AppOption) => {
  globalOptions = options || {};
  // @ts-ignore
  toggleNavigationCalling(true);
  startSpa();
  createCachePool({})
}
