import { AppInfo } from '../type';

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
  public load() {
    if (!this.remoteApp) {
      // this.remoteApp = await createAppLoader(this.appInfo, this.context);
    }
    this.inited = true;
    this.remoteApp.bootstrap();
    return this.remoteApp;
  }

  /**
   * public api for mount logic for app
   */
  public mount({ customProps }: { customProps?: any } = {}) {
    this.remoteApp.bootstrap();
    return this.remoteApp.mount(customProps);
  }

  /**
   * public api for unmount logic for app, it will unmount the node of the app
   * but no destroy the sandbox for app
   */
  public async unmount() {
    this.remoteApp.unmount();
  }

  public getExposedModule<T>(moduleName: string) {
    if (!this.remoteApp.exposedModule) {
      return undefined;
    }

    return this.remoteApp.exposedModule[moduleName] as (T | undefined);
  }
}