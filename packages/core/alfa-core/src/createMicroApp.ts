import { createMicroApp as createConsoleOSMicroApp } from '@alicloud/console-os-kernal';
import { getManifest } from './utils';
import { IAppConfig, IOptions } from './types';

export const createMicroApp = <T>(appConfig: IAppConfig<T>, options: IOptions<T> = {}) => {
  return createConsoleOSMicroApp({
    name: appConfig.name,
    dom: appConfig.container,
    manifest: getManifest(appConfig),
    customProps: appConfig.props,
    deps: appConfig.deps,

    url: appConfig.jsUrl,

    // @ts-ignore
    appWillMount: options.beforeMount,
    // @ts-ignore
    appDidMount: options.afterMount,
    // @ts-ignore
    appWillUnmount: options.beforeUnmount,
    // @ts-ignore
    appDidUnmount: options.afterUnmount,
    // @ts-ignore
    appWillUpdate: options.beforeUpdate
  }, {
    sandBox: options.sandbox
  });
}
