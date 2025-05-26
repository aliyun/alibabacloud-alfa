import parseEnv from '@alicloud/console-base-conf-parse-env';

import { getRelease } from './getRelease';
import cache from './cacheManager';
import { getMicroAppConfig } from './oss';
import { getEnv } from './env';
import request from './request';

import type { AlfaDynamicConfig, IAppConfig, IWin } from '../types';

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

  const configVersion = releaseConfig['dist-tags']?.['config-latest'] || '';
  const configEntry = releaseConfig['config-versions']?.[configVersion]?.entry;

  let configData: AlfaDynamicConfig = defaultConfig;

  // when config is not valid, return empty
  if (!configVersion || !configEntry) return configData;

  try {
    configData = (await cache.getRemote<AlfaDynamicConfig>(configEntry)).data;

    if (!configData) throw new Error('configData is null');
  } catch (e) {
    try {
      const [, category, product] = configEntry.match(/\/(\w+)\/(\w+)\/config.json/) || [];
      configData = await getMicroAppConfig<AlfaDynamicConfig>(category, product, getEnv(config.env));
    } catch (err) {
      // ...
    }

    logger?.error && logger.error({
      E_CODE: 'GetConfigError',
      E_MSG: (e as Error).message,
    });
  }

  return configData;
};

/**
 * 支持从 fecs 接口获取业务配置，获取到的数据和控制台一致，不需要额外处理
 */
export const getConfigV2 = async (config: IAppConfig) => {
  const releaseConfig = await getRelease(config);
  const { relatedConsoleAppId } = releaseConfig.metadata || {};

  if (relatedConsoleAppId) {
    if (relatedConsoleAppId === (window as IWin).ALIYUN_CONSOLE_CONFIG?.APP_ID) {
      return {
        ALIYUN_CONSOLE_CONFIG: (window as IWin).ALIYUN_CONSOLE_CONFIG,
        ALIYUN_CONSOLE_GLOBAL: (window as IWin).ALIYUN_CONSOLE_GLOBAL || {},
      };
    }

    try {
      const res = await request.get<{ ALIYUN_CONSOLE_CONFIG: IWin['ALIYUN_CONSOLE_CONFIG']; ALIYUN_CONSOLE_GLOBAL: Record<string, any> }>(
        `//fecs.console.${parseEnv().MAIN_DOMAIN}/api/alfa/console/config?=appId=${relatedConsoleAppId}`,
      );

      return res.data;
    } catch (e) {
      // ....
    }
  }

  return undefined;
};
