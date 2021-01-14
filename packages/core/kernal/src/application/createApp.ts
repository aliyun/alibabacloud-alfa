import { VMContext } from '@alicloud/console-os-browser-vm';

import { Application } from './Application';
import { createContext } from './createContext';
import * as AppCachePool from './AppCachePool';
import { AppInfo, SandBoxOption } from '../type';
import { getManifest } from '../misc/manifest';

const createAppInstance = async (appInfo: AppInfo, sandBoxOption: SandBoxOption): Promise<Application> => {
  let context: VMContext = { window, document, location, history };

  const app = new Application(appInfo, context, sandBoxOption);
  const promise = new Promise<Application>((resolver, reject) => {
    app.setPendingResolver(resolver);
    app.setPendingRejecter(reject);
  });

  app.setPendingPromise(promise);

  AppCachePool.setApp(appInfo.name, app);

  if (!sandBoxOption.disable) {
    context = await createContext({
      body: appInfo.dom,
      id: appInfo.name,
      externals: sandBoxOption ? sandBoxOption.externalsVars: [],
      url: sandBoxOption.sandBoxUrl,
      disableBody: sandBoxOption.disableFakeBody,
    });
    context.history.replaceState(null, '' , sandBoxOption.initialPath || '/');
  } else {
    // @ts-ignore
    window.__IS_CONSOLE_OS_CONTEXT__ = true
  }

  app.context = context;
  return app;
}

/**
 * Create app instance in kernal
 * 
 * @param appInfo app basic meta info
 * @param sandBoxOption sandbox option for app
 */
export const createApplication = async (appInfo: AppInfo, sandBoxOption: SandBoxOption): Promise<Application> => {
  const manifest = await getManifest(appInfo, appInfo.name);
  appInfo.name = manifest.name;

  let app = AppCachePool.getApp(appInfo.name);

  // if app is init and app is singleton, return the
  // singleton instance for app
  if (app && app.isInited()) {
    // app.context.updateBody is not defined when sandbox disable.
    if (app.context.updateBody && !sandBoxOption.disableFakeBody) {
      app.context.updateBody && app.context.updateBody(appInfo.dom);
    }
    // update the to initialPath every time update the initialPath for iframe
    if (sandBoxOption.syncInitHref && app.context.baseFrame) {
      app.context.baseFrame.contentWindow.history.replaceState(null, null, sandBoxOption.initialPath || '/')
    }
    return app;
  }

  // handle app loading status
  // if app is loading
  if (!app || !app.isInited()) {
    if (app) {
      return new Promise((resolve) => {
        resolve(app.getPendingPromise())
      });
    }
  }

  app = await createAppInstance(appInfo, sandBoxOption)

  app.pendingResolver && app.pendingResolver(app);
  return app;
}