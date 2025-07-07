import { AlfaConfig, IWin } from '@alicloud/alfa-core';

export const getConsoleGlobal = async (configData: AlfaConfig, global: IWin['ALIYUN_CONSOLE_GLOBAL']) => {
  return {
    ...global,
    ...configData?.GLOBAL_DATA,
  };
};
