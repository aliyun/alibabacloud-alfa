import { getLocale } from './locale';
import { getRelease } from './getRelease';
import { IAppConfig } from '../types';
import cache from './cacheManager';

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
  const localeEntry = releaseConfig['locales-versions']?.[localeVersion]?.[locale];

  let messages: Record<string, string> = {};

  if (!localeVersion) return messages;

  try {
    messages = await cache.getRemote<Record<string, string>>(localeEntry);
  } catch (e) {
    logger?.error && logger.error({
      E_CODE: 'GetLocaleError',
      E_MSG: e.message,
    });
  }

  return messages;
};
