import { getConfig, AlfaConfig, IWin, IAppConfig } from '@alicloud/alfa-core';
import md5 from 'crypto-js/md5';

/**
 * transform
 * @param features
 */
//@ts-ignore
const processFeatures = (features: AlfaConfig['ALL_FEATURE_STATUS']) => {
  return Object.keys(features).reduce<Partial<Record<string, boolean>>>((newFeatures, key) => {
    const feature = features[key];

    if (!feature) return newFeatures;

    const uid = (window as IWin).ALIYUN_CONSOLE_CONFIG?.CURRENT_PK || '';
    const md5Uid = md5(uid).toString();

    const {
      enableBlockList, enableSampling, enableWhiteList, sampling, blockList, whiteList,
    } = feature;

    if (enableBlockList && blockList.includes(md5Uid)) {
      newFeatures[key] = false;
    } else if (enableWhiteList && whiteList.includes(md5Uid)) {
      newFeatures[key] = true;
    } else if (enableSampling) {
      const gray = uid.substring(uid.length - 2);

      if (Number(gray) >= sampling * 100 || sampling === 0) newFeatures[key] = false;
      newFeatures[key] = true;
    } else {
      newFeatures[key] = false;
    }

    return newFeatures;
  }, {});
};

const mergeConfigDataWithConsoleConfig = (configData: AlfaConfig, consoleConfig: IWin['ALIYUN_CONSOLE_CONFIG']) => {
  const channel = (window as IWin)?.ALIYUN_CONSOLE_CONFIG?.CHANNEL || 'OFFICIAL';
  const channelLinks = configData.ALL_CHANNEL_LINKS?.[channel] || {};
  const channelFeatures = configData.ALL_CHANNEL_FEATURE_STATUS?.[channel] || {};
  //@ts-ignore
  const features = configData.ALL_FEATURE_STATUS || {};

  return {
    ...consoleConfig,
    CHANNEL_LINKS: channelLinks,
    CHANNEL_FEATURE_STATUS: channelFeatures,
    FEATURE_STATUS: processFeatures(features),
  };
};

export const getConsoleConfig = async (config: IAppConfig, consoleConfig: any) => {
  // TODO: 容灾，获取 ConsoleConfig 失效的情况
  const configData = await getConfig(config);
  return mergeConfigDataWithConsoleConfig(configData, consoleConfig);
};
