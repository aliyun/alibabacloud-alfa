import { IAppConfig } from '../types';

export { getEnv } from './env';
export { getLocale } from './locale';

export const getURL = (appConfig: IAppConfig) => {
  const { entry } = appConfig;
  let url = '';

  if (typeof entry === 'string') {
    url = entry;
  }

  return url;
};

export const getManifestFromConfig = (appConfig: IAppConfig) => {
  // 定义了 entry 时，优先从 entry 生成 manifest
  if (appConfig.entry && typeof appConfig.entry !== 'string') {
    return {
      name: appConfig.name,
      resources: {},
      entrypoints: {
        index: {
          js: appConfig.entry.scripts,
          css: appConfig.entry.styles || [],
        },
      },
    };
  }

  return appConfig.manifest;
};
