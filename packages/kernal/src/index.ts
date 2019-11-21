import { registerApplication as registerSpaApp, start as startSpa, triggerAppChange, getAppNames, unloadApplication, mountRootParcel } from 'single-spa';
import { AppInfo, AppOption } from './type';
import { createContext } from './creatContext';
import { createEventBus } from './createEventBus';
import { flattenFnArray } from './util';
import { createApplication, Application } from './createApp';

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
  const { sandBox } = options;

  // TODO: pre-request for manifest
  
  const context = await createContext({
    initURL: location.href,
    externals: sandBox ? sandBox.externalsVars: []
  });

  const dom = createSandDom(id, context);
  const app = createApplication(appInfo, context);
  const appLoader = () => app.getAppLoader();

  registerSpaApp(name || id, appLoader, activityFn, {
    customProps: {
      domElement: context.document.body,
      emitter: createEventBus()
    }
  })

  return {
    dom,
    context,
    appInfo
  };
}

export const mountApp = async (appInfo: AppInfo, options: AppOption = {}) => {
  const { id } = appInfo;
  const { sandBox } = options;

  const context = await createContext({
    initURL: location.href,
    body: appInfo.dom,
    externals: sandBox ? sandBox.externalsVars: []
  });

  const app = createApplication(appInfo, context);
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

export const start = () => {
  startSpa();
}

export const isAppRegistered = (appName: string) => {
  return getAppNames().indexOf(appName) !== -1;
}

export { triggerAppChange, unloadApplication, createEventBus }

export type OSApplication = Application;