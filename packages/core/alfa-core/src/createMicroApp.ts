import { createMicroApp as createConsoleOSMicroApp } from '@alicloud/console-os-kernal';
import { getManifestFromConfig, getURL } from './utils';
import { IAppConfig, IOptions } from './types';

// TODO: deprecate in next major version
export const createMicroApp = <T extends Record<string, any>>(appConfig: IAppConfig<T>, options: IOptions = {}) => {
  const manifest = getManifestFromConfig(appConfig);
  const url = getURL(appConfig);

  if (!manifest && !url) {
    throw new Error(`No entry or manifest in ${appConfig.name}`);
  }

  return createConsoleOSMicroApp({
    name: appConfig.name,
    dom: appConfig.container,
    manifest,
    customProps: appConfig.props,
    deps: appConfig.deps,

    url,

    // @ts-ignore
    appWillMount: options.beforeMount,
    // @ts-ignore
    appDidMount: options.afterMount,
    // @ts-ignore
    appWillUnmount: options.beforeUnmount,
    // @ts-ignore
    appDidUnmount: options.afterUnmount,
    // @ts-ignore
    appWillUpdate: options.beforeUpdate,
  }, {
    sandbox: options.sandbox,
  });
};
