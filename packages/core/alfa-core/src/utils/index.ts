import { EnvEnum, IAppConfig, IWin, LOCALE } from '../types';

/**
 * get alfa env
 * @returns
 */
export const getAlfaEnv = (): EnvEnum => {
  if (process.env.NODE_ENV === 'development') {
    return 'local';
  }

  // default return prod
  return (window as IWin)?.ALIYUN_CONSOLE_CONFIG?.fEnv || 'prod';
};

/**
 * get alfa Locale and replace '-' to '_'
 * example: en-US => en_US
 * @returns
 */
export const getAlfaLocale = (): LOCALE => {
  const locale = ((window as IWin)?.ALIYUN_CONSOLE_CONFIG?.LOCALE || '').replace('-', '_');

  if (['zh_CN', 'en_US', 'ja_JP', 'zh_TW', 'zh-HK'].includes(locale)) return locale as LOCALE;
  return 'en_US';
};

/**
 * get alfa release url
 * @param appId
 * @param env
 * @returns
 */
export const getReleaseUrl = (name?: string, env?: string): string | undefined => {
  const cdnUrl = `https://cws.alicdn.com/Release/alfa/${name}/release.json`;
  const cdnPreUrl = `https://cws2.alicdn.com/Prepub/alfa/${name}/release.json`;

  switch (env) {
    case 'local':
      return (process.env.ALFA_RELEASE_URL) as string || cdnPreUrl;
    case 'daily':
      return cdnPreUrl;
    case 'pre':
      return cdnPreUrl;
    case 'prod':
      return cdnUrl;
    default:
      break;
  }

  return undefined;
};

/**
 * get alfa config url
 * @param appId
 * @param env
 * @returns
 */
export const getConfigUrl = (name?: string, env?: string): string | undefined => {
  const configUrl = `https://cws.alicdn.com/Release/alfa-products/${name}/config.json`;
  const configPreUrl = `https://cws2.alicdn.com/Prepub/alfa-products/${name}/config.json`;

  switch (env) {
    case 'local':
      return configPreUrl;
    case 'daily':
      return configPreUrl;
    case 'pre':
      return configPreUrl;
    case 'prod':
      return configUrl;
    default:
      break;
  }

  return undefined;
};


export const resolveReleaseUrl = (config: IAppConfig) => {
  const { name, env } = config;

  return getReleaseUrl(name, env || getAlfaEnv());
};

export const resolveConfigUrl = (config: IAppConfig) => {
  const { name, env } = config;

  return getConfigUrl(name, env || getAlfaEnv());
};

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
          css: appConfig.entry.styles,
        },
      },
    };
  }

  return appConfig.manifest;
};
