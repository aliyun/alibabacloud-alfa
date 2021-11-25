import axios from 'axios';

import { resolveConfigUrl } from '.';
import { AlfaFactoryOption, AlfaDynamicConfig } from '../types';

const cachedConfig: Record<string, AlfaDynamicConfig> = {};

const productReg = /@ali\/alfa-cloud-([a-zA-z]*)-(app|widget)-.*/;

const defaultConfig: AlfaDynamicConfig = {
  ALL_CHANNEL_FEATURE_STATUS: {},
  ALL_CHANNEL_LINKS: {},
  ALL_FEATURE_STATUS: {},
};

/**
 * 获取 Alfa 平台配置的 Config
 * @param option
 * @returns
 */
export const getConfig = async (option: AlfaFactoryOption) => {
  const matches = option.name.match(productReg);

  if (!matches) {
    return defaultConfig;
  }

  const configId = matches[1] || option.name;

  if (!cachedConfig[configId]) {
    try {
      const resp = await axios.get<AlfaDynamicConfig>(resolveConfigUrl({
        ...option,
        name: configId,
      }));
      const configData = resp.data;

      cachedConfig[configId] = configData;
    } catch (e) {
      // Nothing
    }
  }

  return cachedConfig[configId] || defaultConfig;
};
