import { IAppConfig, getConfig, getLocale, IWin } from '@alicloud/alfa-core';

import { getConsoleConfig } from '../utils/getConsoleConfig';
import { getConsoleGlobal } from '../utils/getConsoleGlobal';

// inject consoleConfig & locales after load
async function afterLoadHook(appConfig: IAppConfig) {
  const { app, logger } = appConfig;

  const defaultConsoleConfig = (window as IWin).ALIYUN_CONSOLE_CONFIG || {};
  const defaultConsoleGlobal = (window as IWin).ALIYUN_CONSOLE_GLOBAL || {};

  const CONFIG_START_TIME = Date.now();

  const configData = await getConfig(appConfig);

  const [consoleConfig, consoleGlobal, messages] =
    await Promise.all([
      getConsoleConfig(configData, defaultConsoleConfig),
      getConsoleGlobal(configData, defaultConsoleGlobal),
      getLocale(appConfig),
    ]);

  const CONFIG_END_TIME = Date.now();

  const i18nMessages = {
    ...(window as IWin).ALIYUN_CONSOLE_I18N_MESSAGE,
    ...messages,
  };


  // inject global variables
  if (app && app.context) {
    (app.context.window as IWin).ALIYUN_CONSOLE_CONFIG = consoleConfig;
    (app.context.window as IWin).ALIYUN_CONSOLE_GLOBAL = consoleGlobal;
    (app.context.window as IWin).ALIYUN_CONSOLE_I18N_MESSAGE = i18nMessages;
  }

  const END_TIME = Date.now();

  logger?.record && logger.record({
    CONFIG_START_TIME,
    CONFIG_END_TIME,
    END_TIME,
  });

  logger?.send && logger.send();

  return appConfig;
}

export default afterLoadHook;
