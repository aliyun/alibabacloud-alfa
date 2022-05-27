import { AppInfo, IIsomorphicEnvironment } from '../type';

/**
 * Application
 */
export class Application {
  public remoteApp;

  private appInfo: AppInfo;
  private inited: boolean;

  public constructor(appInfo: AppInfo) {
    this.appInfo = appInfo;
    this.inited = false;
  }

  public isInited() {
    return this.inited;
  }

  /**
   *
   */
  public load(env: IIsomorphicEnvironment) {
    this.remoteApp = env.getBundle(this.appInfo.manifest);
    if (!this.remoteApp) {
      /**
       * 这里对于 Server App 来说通过 fetchBundle 通知服务实现方异步的去拉取 bundle
       */
      env.fetchBundle(this.appInfo.manifest);
      return null;
    }
    this.inited = true;
    this.remoteApp.bootstrap();
    return this.remoteApp;
  }

  /**
   * public api for mount logic for app
   */
  public mount({ customProps }: { customProps?: any } = {}) {
    if (!this.inited) {
      return null;
    }
    return this.remoteApp.mount(customProps);
  }

  /**
   * public api for unmount logic for app, it will unmount the node of the app
   * but no destroy the sandbox for app
   */
  public unmount() {
    if (!this.remoteApp) {
      return null;
    }
    this.remoteApp.unmount();
  }

  public getExposedModule<T>(moduleName: string) {
    if (!this.remoteApp?.exposedModule) {
      return undefined;
    }

    return this.remoteApp.exposedModule[moduleName] as (T | undefined);
  }
}