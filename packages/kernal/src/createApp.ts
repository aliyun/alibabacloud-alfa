import { AppInfo } from './type';
import { createAppLoader } from './createAppLoader';
import { removeContext } from '@alicloud/console-os-browser-vm';
import { Parcel } from 'single-spa';

export class Application {
  private appinfo: AppInfo;
  private context: VMContext;
  public parcel?: Parcel;

  public constructor(appInfo: AppInfo, context: VMContext) {
    this.appinfo = appInfo;
    this.context = context;
  }

  public getAppLoader() {
    return createAppLoader(this.appinfo, this.context);
  }

  public async dispose() {
    await removeContext(this.context);
    return this.parcel.unmount();
  }

  public attachParcel(parcel: Parcel) {
    this.parcel = parcel;
  }
}

export const createApplication = (appInfo: AppInfo, context: VMContext) => {
  const app = new Application(appInfo, context);
  return app;
}