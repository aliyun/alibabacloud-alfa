import { AppInfo, SandBoxOption } from './type';
import { createAppLoader } from './createAppLoader';
import { createContext } from './creatContext';
import { getApp, setApp } from './AppCachePool';
import VMContext, { removeContext } from '@alicloud/console-os-browser-vm';
import { Parcel } from 'single-spa';

export class Application {
  private appinfo: AppInfo;
  public readonly context: VMContext;
  public parcel?: Parcel;
  public remoteApp;

  public constructor(appInfo: AppInfo, context: VMContext) {
    this.appinfo = appInfo;
    this.context = context;
  }

  public async getAppLoader() {
    if (!this.remoteApp) {
      this.remoteApp = await createAppLoader(this.appinfo, this.context);
    }
    return this.remoteApp;
  }

  public async unmount() {
    return this.parcel.unmount();
  }

  public async dispose() {
    await removeContext(this.context);
    return this.parcel.unmount();
  }

  public attachParcel(parcel: Parcel) {
    this.parcel = parcel;
  }
}

export const createApplication = async (appInfo: AppInfo, sandBoxOption: SandBoxOption) => {
  // 根据是否单例来决定 APP 是否缓存
  // 这里是为了性能考虑 从功能性上做了折中
  // 每个实例
  let app = getApp(appInfo.id);
  if (app && sandBoxOption.singleton) {
    return app;
  } else {
    let context: VMContext = {window, document, location, history};
    if (!sandBoxOption.disable) {
      context = await createContext({
        initURL: location.href,
        body: appInfo.dom,
        externals: sandBoxOption ? sandBoxOption.externalsVars: [],
        url: sandBoxOption.sandBoxUrl
      });

    } else {
      // @ts-ignore
      window.__CONSOLE_OS_GLOBAL_VARS_ = {};
      // @ts-ignore
      window.__IS_CONSOLE_OS_CONTEXT__ = true
    }
    app = new Application(appInfo, context);
    setApp(appInfo.id, app);
  }
  return app;
}