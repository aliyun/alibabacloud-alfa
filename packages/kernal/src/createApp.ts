import VMContext, { removeContext } from '@alicloud/console-os-browser-vm';
import { Parcel } from 'os-single-spa';
import { AppInfo, SandBoxOption } from './type';
import { createAppLoader } from './createAppLoader';
import { createContext } from './creatContext';
import { getApp, setApp } from './AppCachePool';
import { createEventBus } from './createEventBus';
import { serializeData } from './util';

const eventBus = createEventBus();

export class Application {
  private appinfo: AppInfo;
  public readonly context: VMContext;
  public parcel?: Parcel;
  public remoteApp;
  public allowEvents: string[];

  public constructor(appInfo: AppInfo, context: VMContext, option?: SandBoxOption) {
    this.appinfo = appInfo;
    this.context = context; 

    const DEFAULT_EVENTS = [`${this.appinfo.id}:history-change`];

    this.allowEvents = option.allowEvents ? [
      ...option.allowEvents,
      ...DEFAULT_EVENTS
    ]: [
      ...DEFAULT_EVENTS
    ];
  }

  public async getAppLoader() {
    if (!this.remoteApp) {
      this.remoteApp = await createAppLoader(this.appinfo, this.context);
    }
    return this.remoteApp;
  }

  public mount() {
    const { baseFrame } = this.context;
    if (baseFrame) {
      baseFrame.contentWindow.addEventListener('popstate', this.emitLocaitonChange);
      baseFrame.contentWindow.addEventListener('message', this.emitGlobalEvent);
    }
  }

  public async unmount() {
    const { baseFrame } = this.context;
    if (baseFrame) {
      baseFrame.contentWindow.removeEventListener('popstate', this.emitLocaitonChange);
      baseFrame.contentWindow.removeEventListener('message', this.emitGlobalEvent);
    }
    return this.parcel.unmount();
  }

  public async dispose() {
    await removeContext(this.context);
    return this.parcel.unmount();
  }

  public attachParcel(parcel: Parcel) {
    this.parcel = parcel;
  }

  private emitLocaitonChange = () => {
    eventBus.emit(`${this.appinfo.id}:history-change`, this.context.location)
  }

  private emitGlobalEvent = (e: MessageEvent) => {
    const payload = e.data;
    if (!payload.type || this.allowEvents.indexOf(e.data.type) === -1) {
      return;
    }
    payload.appId = this.appinfo.id;
    if (payload.type === `${this.appinfo.id}:history-change`) {
      this.emitLocaitonChange()
    } else {
      eventBus.emit(payload.type, serializeData(e.data))
    }
  }
}

export const createApplication = async (appInfo: AppInfo, sandBoxOption: SandBoxOption) => {
  let app = getApp(appInfo.id);
  if (app && sandBoxOption.singleton) {
    return app;
  }

  let context: VMContext = { window, document, location, history };

  if (!sandBoxOption.disable) {
    context = await createContext({
      initURL: location.href,
      body: appInfo.dom,
      id: appInfo.id,
      externals: sandBoxOption ? sandBoxOption.externalsVars: [],
      url: sandBoxOption.sandBoxUrl
    });

    if (sandBoxOption.initialPath) {
      context.history.pushState(null, '' , sandBoxOption.initialPath);
    }
  } else {
    // @ts-ignore
    window.__CONSOLE_OS_GLOBAL_VARS_ = {};
    // @ts-ignore
    window.__IS_CONSOLE_OS_CONTEXT__ = true
  }

  app = new Application(appInfo, context, sandBoxOption);
  setApp(appInfo.id, app);

  return app;
}