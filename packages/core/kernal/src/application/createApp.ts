import VMContext from '@alicloud/console-os-browser-vm';

import { Application } from './Application';
import { createContext } from './createContext';
import * as AppCachePool from './AppCachePool';
import { AppInfo, SandBoxOption } from '../type';

const createAppInstance = async (appInfo: AppInfo, sandBoxOption: SandBoxOption) => {
  let context: VMContext = { window, document, location, history };

  if (!sandBoxOption.disable) {
    context = await createContext({
      body: appInfo.dom,
      id: appInfo.id,
      externals: sandBoxOption ? sandBoxOption.externalsVars: [],
      url: sandBoxOption.sandBoxUrl
    });
    context.history.replaceState(null, '' , sandBoxOption.initialPath || '/');
  } else {
    // @ts-ignore
    window.__IS_CONSOLE_OS_CONTEXT__ = true
  }

  return new Application(appInfo, context, sandBoxOption);
}

/**
 * Create app instance in kernal
 * 
 * @param appInfo app basic meta info
 * @param sandBoxOption sandbox option for app
 */
export const createApplication = async (appInfo: AppInfo, sandBoxOption: SandBoxOption) => {
  if (!sandBoxOption.singleton) {
    return await createAppInstance(appInfo, sandBoxOption);
  }

  let app = AppCachePool.getApp(appInfo.id);

  // if app is init and app is singleton, return the
  // singleton instance for app
  if (app && app.isInited()) {
    // app.context.updateBody is not defined when sandbox disable.
    app.context.updateBody && app.context.updateBody(appInfo.dom)
    return app;
  }

  // handle app loading status
  // if app is loading
  if (!app || !app.isInited()) {
    if (app) {
      return app.getPendingPromise();
    }
  } else {
    if (app) {
      const promise = new Promise<Application>((resolver, reject) => {
        app.setPendingResolver(resolver);
        app.setPendingRejecter(reject);
      })
      app.setPendingPromise(promise)
    }
  }

  app = await createAppInstance(appInfo, sandBoxOption)
  app.pendingResolver && app.pendingResolver(app);
  AppCachePool.setApp(appInfo.id, app);

  return app;
}