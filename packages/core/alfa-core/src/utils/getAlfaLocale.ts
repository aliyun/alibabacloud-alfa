import { getAlfaLocale } from './index';
import { getRelease } from './getAlfaRelease';
import { IAppConfig } from '../types';
import cache from './cacheManager';


/**
 * 获取国际化文案
 * @param config
 * @returns
 */
export const getLocale = async (config: IAppConfig) => {
  const releaseConfig = await getRelease(config);

  const locale = getAlfaLocale();
  const version = releaseConfig['dist-tags']?.['locales-latest'];
  const localeEntry = releaseConfig['locales-versions']?.[version]?.[locale];

  let messages: Record<string, string> = {};

  if (!localeEntry) {
    // TODO: record
    return messages;
  }

  try {
    messages = await cache.getRemote<Record<string, string>>(localeEntry);
  } catch (e) {
    // TODO: record
  }

  return messages;
};
