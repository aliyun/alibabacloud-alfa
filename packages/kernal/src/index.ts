import { registerApplication as registerSpaApp, start as startSpa, triggerAppChange, getAppNames, unloadApplication, mountRootParcel } from 'single-spa';
import { AppInfo, AppOption } from './type';
import { createEventBus } from './createEventBus';
import { flattenFnArray } from './util';
import { createApplication, Application } from './createApp';
import VMContext from '@alicloud/console-os-browser-vm';
import { createCachePool } from './AppCachePool';


let globalOptions: AppOption = {};

/**
 * Create sand dom for an app
 * @param {string} id 
 * @param {VMContext} context 
 */
export const createSandDom = (id: string, context: VMContext) => {
  const wrapper = document.createElement(id);
  wrapper.appendChild(context.document.body);
  context.document.body.className = id;
  context.document.body.style.cssText = "padding-top: 0"
  return wrapper;
}

/**
 * 
 * @param {AppInfo} appInfo 
 */
export const registerApplication = async (appInfo: AppInfo, options: AppOption = {}) => {
  const { name, id, activityFn } = appInfo;

  const sandBox = {
    singleton: true,
    ...globalOptions.sandBox,
    ...options.sandBox,
  }

  const app = await createApplication(appInfo, sandBox);
  const dom = createSandDom(id, app.context);

  if(appInfo.dom) {
    appInfo.dom.appendChild(dom);
  }

  const appLoader = () => app.getAppLoader();

  registerSpaApp(name || id, appLoader, activityFn, {
    customProps: {
      domElement: app.context.document.body,
      emitter: createEventBus()
    }
  });

  return app;
}

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

export const start = (options?: AppOption) => {
  globalOptions = options || {};
  startSpa();
  createCachePool({})
}

export const isAppRegistered = (appName: string) => {
  return getAppNames().indexOf(appName) !== -1;
}

export { triggerAppChange, unloadApplication, createEventBus }

export type OSApplication = Application;