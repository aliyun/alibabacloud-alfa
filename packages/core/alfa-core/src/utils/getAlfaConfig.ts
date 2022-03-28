import { AlfaDynamicConfig, IAppConfig } from '../types';
import { getRelease } from './getAlfaRelease';
import cache from './cacheManager';

const defaultConfig: AlfaDynamicConfig = {
  ALL_CHANNEL_FEATURE_STATUS: {},
  ALL_CHANNEL_LINKS: {},
  ALL_FEATURE_STATUS: {},
  GLOBAL_DATA: {},
};

/**
 * 获取 Alfa 平台配置的 Config
 * @param config
 * @returns
 */
export const getConfig = async (config: IAppConfig) => {
  const releaseConfig = await getRelease(config);

  const { logger } = config;

  const configVersion = releaseConfig['dist-tags']?.['config-latest'];
  const configEntry = releaseConfig['config-versions']?.[configVersion]?.entry;

  let configData: AlfaDynamicConfig = defaultConfig;

  // when config is not valid, return empty
  if (!configVersion || !configEntry) return configData;

  try {
    configData = await cache.getRemote<AlfaDynamicConfig>(configEntry);
  } catch (e) {
    logger?.error && logger.error({
      E_CODE: 'GetConfigError',
      E_MSG: e.message,
    });
  }

  return configData;
};
