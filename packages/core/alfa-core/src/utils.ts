import template from 'lodash/template';

import { ENV } from './env';
import { AlfaFactoryOption, IAppConfig } from './types';

export const resolveReleaseUrl = (option: AlfaFactoryOption) => {
  // 如果没找环境到 fallback 到 prod
  const env = ENV[option.env] || ENV.prod;
  
  return template(env.releaseUrl)({ appId: option.name })
}

export const getManifest = (appConfig: IAppConfig) => {
  // Entry 优先生效
  if (appConfig.entry) {
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

  if (!appConfig.manifest) {
    new Error(`No entry or manifest in ${appConfig.name}`)
  }

  return appConfig.manifest;
}