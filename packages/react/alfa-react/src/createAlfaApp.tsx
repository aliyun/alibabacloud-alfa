import React from 'react';
import { BaseLoader, getManifest, getLocale, IWin } from '@alicloud/alfa-core';

import ErrorBoundary from './components/ErrorBoundary';
import { getConsoleConfig } from './utils/getConsoleConfig';
import { AlfaFactoryOption } from './types';
import createApplication from './createApplication';

const loader = BaseLoader.create();

// get manifest before resolve
// normalize name
loader.beforeResolve.use(async (appConfig) => {
  let { manifest: resolvedManifest } = appConfig;
  if (!resolvedManifest) {
    resolvedManifest = await getManifest(appConfig);
  }

  return {
    ...appConfig,
    manifest: resolvedManifest,
  };
}, undefined);

// inject consoleConfig & locales after load
loader.afterLoad.use(async (appConfig) => {
  const { app } = appConfig;

  const defaultConsoleConfig = (window as IWin).ALIYUN_CONSOLE_CONFIG || {};
  const consoleConfig = await getConsoleConfig(appConfig, defaultConsoleConfig);

  const messages = await getLocale(appConfig);

  const i18nMessages = {
    ...(window as IWin).ALIYUN_CONSOLE_I18N_MESSAGE,
    ...messages,
  };

  if (app && app.context) {
    (app.context.window as IWin).ALIYUN_CONSOLE_CONFIG = consoleConfig;
    (app.context.window as IWin).ALIYUN_CONSOLE_I18N_MESSAGE = i18nMessages;
  }

  return appConfig;
}, undefined);

const Application = createApplication(loader);

function createAlfaApp<P = any>(option: AlfaFactoryOption) {
  const { name, dependencies } = option || {};

  // check app option
  if (!name) return () => null;

  const passedInOption = option;

  return React.memo((props: P) => (
    <ErrorBoundary>
      <Application<P>
        {...passedInOption}
        deps={dependencies || {}}
        customProps={props}
      />
    </ErrorBoundary>
  ));
}

export default createAlfaApp;
