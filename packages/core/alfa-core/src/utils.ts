import template from 'lodash/template';

import { ENV, getConsoleEnv } from './env';
import { AlfaFactoryOption, IAppConfig } from './types';

export const resolveReleaseUrl = (option: AlfaFactoryOption) => {
  // 如果没找环境到 fallback 到 prod
  const env = ENV[option.env || getConsoleEnv()] || ENV.prod;

  return template(env.releaseUrl)({ appId: option.name });
}

export const resolveConfigUrl = (option: AlfaFactoryOption) => {
  // 如果没找环境到 fallback 到 prod
  const env = ENV[option.env || getConsoleEnv()] || ENV.prod;
  return template(env.configUrl)({ appId: option.name });
}


export const getURL = (appConfig: IAppConfig) => {

  const { entry } = appConfig;
  let url = '';

  if (typeof entry === 'string') {
    url = entry;
  }

  return url;
}

export const getManifest = (appConfig: IAppConfig) => {

  // 定义了 entry 时，优先从 entry 生成 manifest
  if (appConfig.entry && typeof appConfig.entry !== 'string') {
    return {
      name: appConfig.name,
      resources: {},
      entrypoints: {
        index: {
          js: appConfig.entry.scripts,
          css: appConfig.entry.styles,
        }
      }
    };
  }

  return appConfig.manifest;
}
