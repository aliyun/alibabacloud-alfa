import { getConfig, AlfaConfig, AlfaFactoryOption } from '@alicloud/alfa-core';

const mergeConfigDataWithConsoleConfig = (configData: AlfaConfig, consoleConfig: any) => {
  // @ts-ignore
  const channel = window?.ALIYUN_CONSOLE_CONFIG?.CHANNEL || 'OFFICIAL';
  const channelLinks = configData.ALL_CHANNEL_LINKS ? configData.ALL_CHANNEL_LINKS[channel] : {};
  const features = configData.ALL_CHANNEL_FEATURE_STATUS ? configData.ALL_CHANNEL_FEATURE_STATUS[channel] : {};
  return {
    ...consoleConfig,
    CHANNEL_LINKS: channelLinks,
    CHANNEL_FEATURE_STATUS: features,
  }
}

export const getConsoleConfig = async (option: AlfaFactoryOption, consoleConfig: any) => {
  // TODO: 容灾，获取 ConsoleConfig 失效的情况
  const configData = await getConfig(option);
  return mergeConfigDataWithConsoleConfig(configData, consoleConfig)
}