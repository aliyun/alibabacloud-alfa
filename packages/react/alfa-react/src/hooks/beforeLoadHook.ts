import { IAppConfig, getLocale, IWin } from '@alicloud/alfa-core';

import { getConsoleConfig } from '../utils/getConsoleConfig';

// inject consoleConfig & locales after load
async function afterLoadHook(appConfig: IAppConfig) {
  const { app, logger } = appConfig;

  const defaultConsoleConfig = (window as IWin).ALIYUN_CONSOLE_CONFIG || {};

  const CONFIG_START_TIME = Date.now();

  const [consoleConfig, messages] =
    await Promise.all([getConsoleConfig(appConfig, defaultConsoleConfig), getLocale(appConfig)])
      .catch((e) => {
        logger?.error({
          E_MSG: 'fetch config & locale error.',
          E_STACK: e,
        });
        return [{}, {}];
      });

  const CONFIG_END_TIME = Date.now();

  const i18nMessages = {
    ...(window as IWin).ALIYUN_CONSOLE_I18N_MESSAGE,
    ...messages,
  };

  if (app && app.context) {
    (app.context.window as IWin).ALIYUN_CONSOLE_CONFIG = consoleConfig;
    (app.context.window as IWin).ALIYUN_CONSOLE_I18N_MESSAGE = i18nMessages;
    // (app.context.history as any) = {};
  }

  const END_TIME = Date.now();

  logger?.record({
    CONFIG_START_TIME,
    CONFIG_END_TIME,
    END_TIME,
  });

  logger?.send();

  return appConfig;
}

export default afterLoadHook;
