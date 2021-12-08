import React, { Suspense, lazy, useRef, useEffect, useState } from 'react';

import { getManifest, getLocale, createMicroApp, IWin, IAppConfig } from '@alicloud/alfa-core';
import { IProps } from './types/base';
import Loading from './components/Loading';
import { MicroApplication, AlfaFactoryOption } from './types';
import ErrorBoundary from './components/ErrorBoundary';
import { getConsoleConfig } from './utils/getConsoleConfig';
import { normalizeName } from './utils';

const getProps = (props: Partial<IProps>) => {
  const parcelProps = { ...props };

  delete parcelProps.manifest;
  delete parcelProps.sandbox;
  delete parcelProps.loading;
  delete parcelProps.entry;
  delete parcelProps.container;
  delete parcelProps.logger;
  delete parcelProps.env;
  delete parcelProps.dependencies;

  return parcelProps;
};

const Application: React.FC<IProps> = (props: IProps) => {
  const { sandbox, name, loading, style, className, consoleConfig, i18nMessages } = props;
  const [mounted, setMounted] = useState(false);
  const [app, setApp] = useState<MicroApplication | null>(null);
  const appRef = useRef<HTMLElement | null | undefined>(null);

  useEffect(() => {
    (async () => {
      const App = await createMicroApp({
        ...props,
        container: appRef.current,
        props: getProps(props),
      }, { sandbox });

      if (App.context && App.context) {
        (App.context.window as IWin).ALIYUN_CONSOLE_CONFIG = consoleConfig;
        (App.context.window as IWin).ALIYUN_CONSOLE_I18N_MESSAGE = i18nMessages;
      }

      await App.load();

      if (!appRef.current) return;
      await App.mount(appRef.current, {
        customProps: getProps(props),
      });

      setMounted(true);
      setApp(App);
    })();

    return () => {
      app && app.unmount();
    };
  });

  if (app) {
    app.update(getProps(props));
  }

  return (
    <>
      { !mounted && <Loading loading={loading} /> }
      {
        (sandbox && sandbox !== true && sandbox.disableFakeBody)
          ? React.createElement(name, { style, className, ref: appRef, dataId: name })
          : React.createElement(name, {}, React.createElement('div', { ref: appRef }))
      }
    </>
  );
};


export function createAlfaApp<T = any>(option: AlfaFactoryOption) {
  const { name, loading, manifest } = option;

  const AlfaApp = lazy(async () => {
    let resolvedManifest = manifest;
    if (!manifest) {
      resolvedManifest = await getManifest(option);
    }

    let consoleConfig = (window as IWin).ALIYUN_CONSOLE_CONFIG || {};
    consoleConfig = await getConsoleConfig(option as IAppConfig, consoleConfig);

    const messages = await getLocale(option);
    const i18nMessages = {
      ...(window as IWin).ALIYUN_CONSOLE_I18N_MESSAGE,
      ...messages,
    };

    const App: React.FC<IProps> = (props: IProps) => {
      return (
        <Application
          manifest={resolvedManifest}
          {...props}
          name={normalizeName(name)}
          consoleConfig={consoleConfig}
          i18nMessages={i18nMessages}
        />
      );
    };
    return { default: App };
  });

  return (props: T) => (
    <ErrorBoundary {...props}>
      <Suspense fallback={<Loading loading={loading} />}>
        <AlfaApp
          {...option}
          deps={option.dependencies || {}}
          {...props}
        />
      </Suspense>
    </ErrorBoundary>
  );
}

export { AlfaFactoryOption };
