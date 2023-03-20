import { VMContext } from '@alicloud/console-os-browser-vm';

import { Application } from './Application';
import { createContext } from './createContext';
import * as AppCachePool from './AppCachePool';
import { AppInfo, SandBoxOption } from '../type';
import { getManifest } from '../misc/manifest';
import * as _aliOSKernel from '../index';

const createAppInstance = async (appInfo: AppInfo, appName: string, sandBoxOption: SandBoxOption, noCache = false): Promise<Application> => {
  let context: VMContext = { window, document, location, history };

  const app = new Application(appInfo, context, sandBoxOption);
  const promise = new Promise<Application>((resolver, reject) => {
    app.setPendingResolver(resolver);
    app.setPendingRejecter(reject);
  });

  app.setPendingPromise(promise);

  if (!noCache) AppCachePool.setApp(appName, app);

  if (!sandBoxOption.disable) {
    context = await createContext({
      body: appInfo.dom,
      id: appName,
      externals: sandBoxOption ? sandBoxOption.externalsVars : [],
      url: sandBoxOption.sandBoxUrl,
      disableBody: sandBoxOption.disableFakeBody,
      allowResources: sandBoxOption.allowResources,
      enableScriptEscape: false,
    });

    // throw error when iframe is about:blank
    try {
      if (context.history && context.history.replaceState && sandBoxOption.sandBoxUrl !== 'about:blank') {
        context.history.replaceState(null, '', sandBoxOption.initialPath || '/');
      }
    } catch (e) {
      console.error(e);
    }
  } else {
    // FIXME: 污染了全局环境
    // @ts-ignore
    window.__IS_CONSOLE_OS_CONTEXT__ = true;
  }

  // @ts-ignore
  context.__IS_CONSOLE_OS_CONTEXT__ = true;

  // @ts-ignore
  context._aliOSKernel = appInfo.sharingKernel ? _aliOSKernel : null;

  app.context = context;
  return app;
};

/**
 * Create app instance in kernal
 *
 * @param appInfo app basic meta info
 * @param sandBoxOption sandbox option for app
 */
export const createApplication = async (appInfo: AppInfo, sandBoxOption: SandBoxOption): Promise<Application> => {
  const { name, noCache = false } = appInfo;
  const manifest = await getManifest(appInfo, name);
  const appName = manifest.name;

  // FIXME: 覆写 appInfo.name，其它地方会用到
  appInfo.name = appName;

  let app = noCache ? null : AppCachePool.getApp(appName);

  // if app is init and app is singleton, return the
  // singleton instance for app
  if (app && app.isInited()) {
    // app.context.updateBody is not defined when sandbox disable.
    if (app.context.updateBody && !sandBoxOption.disableFakeBody) {
      app.context.updateBody && app.context.updateBody(appInfo.dom);
    }
    // update the to initialPath every time update the initialPath for iframe
    if (sandBoxOption.syncInitHref && app.context.baseFrame) {
      app.context.baseFrame.contentWindow.history.replaceState(null, null, sandBoxOption.initialPath || '/');
    }
    return app;
  }

  // handle app loading status
  // if app is loading
  if (app && !app.isInited()) {
    return new Promise((resolve) => {
      resolve(app.getPendingPromise());
    });
  }

  app = await createAppInstance(appInfo, appName, sandBoxOption, noCache);

  app.pendingResolver && app.pendingResolver(app);
  return app;
};
