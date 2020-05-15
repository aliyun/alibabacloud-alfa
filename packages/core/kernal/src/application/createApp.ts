import VMContext from '@alicloud/console-os-browser-vm';

import { Application } from './Application';
import { createContext } from './creatContext';
import * as AppCachePool from './AppCachePool';
import { AppInfo, SandBoxOption } from '../type';

/**
 * Create app instance in kernal
 * 
 * @param appInfo app basic meta info
 * @param sandBoxOption sandbox option for app
 */
export const createApplication = async (appInfo: AppInfo, sandBoxOption: SandBoxOption) => {
  let app = AppCachePool.getApp(appInfo.id);

  if (app && sandBoxOption.singleton) {
    app.context.updateBody(appInfo.dom)
    return app;
  }

  let context: VMContext = { window, document, location, history };

  if (!sandBoxOption.disable) {
    // todo: wait for createContext success
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

  app = new Application(appInfo, context, sandBoxOption);
  AppCachePool.setApp(appInfo.id, app);

  return app;
}