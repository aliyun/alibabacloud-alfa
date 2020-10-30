import { createMicroApp as createConsoleOSMicroApp } from '@alicloud/console-os-kernal';

export interface IAppManifest {
  scripts: string[];
  styles: string[];
}

export interface IAppConfig<T = any> {
  entry: IAppManifest;
  name: string;
  container?: HTMLElement;
  props?: Record<string, T>;
}

export interface IOptions<T = any> {

}

const createMicroApp = <T>(appConfig: IAppConfig<T>, options?: IOptions<T>) => {

  // todo: 消费 options


  return createConsoleOSMicroApp({
    name: appConfig.name,
    dom: appConfig.container,
    manifest: {
      name: appConfig.name,
      resources: {},
      entrypoints: {
        index: {
          js: appConfig.entry.scripts,
          css: appConfig.entry.styles,
        }
      }
    }
  });
}

 export default createMicroApp;
