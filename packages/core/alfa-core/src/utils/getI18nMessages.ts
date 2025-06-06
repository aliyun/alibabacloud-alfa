import { getLocale } from './locale';
import { getRelease } from './getRelease';
import cache from './cacheManager';
import { getMicroAppLocale } from './oss';
import { getEnv } from './env';

import { IAppConfig } from '../types';

type LocaleMessages = Record<string, string>;

/**
 * 获取国际化文案
 * @param config
 * @returns
 */
export const getI18nMessages = async (config: IAppConfig) => {
  const releaseConfig = await getRelease(config);

  const { logger } = config;

  const locale = getLocale(config.locale);
  const localeVersion = releaseConfig['dist-tags']?.['locales-latest'] || '';
  const matchKey = Object.keys(releaseConfig['locales-versions']?.[localeVersion] || {}).find((key) => key && key.toLowerCase() === locale.toLowerCase());
  const localeEntry = matchKey && releaseConfig['locales-versions']?.[localeVersion]?.[matchKey];

  let messages: LocaleMessages = {};

  if (!localeVersion) return messages;

  try {
    messages = (await cache.getRemote<LocaleMessages>(localeEntry)).data;
    if (!messages) throw new Error('messages is null');
  } catch (e) {
    try {
      messages = (await getMicroAppLocale<LocaleMessages>(config.name, localeVersion, locale, getEnv(config.env)));
    } catch (err) {
      // ...
    }

    logger?.error && logger.error({
      E_CODE: 'GetLocaleError',
      E_MSG: (e as Error).message,
    });
  }

  return messages;
};

export const getI18nMessagesV2 = async (config: IAppConfig) => {
  const releaseConfig = await getRelease(config);
  const { relatedMDSAppName } = releaseConfig.metadata || {};
  const locale = getLocale(config.locale);

  const globalNamespace = `${relatedMDSAppName}_${locale}`;

  if (relatedMDSAppName && (window as Record<string, any>)[globalNamespace]) {
    return (window as Record<string, any>)[globalNamespace];
  }

  return getI18nMessages(config);
};
