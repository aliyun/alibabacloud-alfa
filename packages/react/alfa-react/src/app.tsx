import React, { Suspense, lazy, useRef, useEffect, useState } from 'react';

import { getManifest, createMicroApp } from '@alicloud/alfa-core'
import { IProps } from './base';
import Loading from './components/Loading';
import { AlfaFactoryOption, MicroApplication } from './types';
import ErrorBoundary from './components/ErrorBoundary';
import { getConsoleConfig } from './app/getConsoleConfig';
import { createIsomorphicAlfaApp } from './app/createIsomorphicMicroApp';
import { normalizeName, isSSR } from './utils';

const getProps = (props: Partial<IProps>) => {
  const parcelProps = {...props};

  delete parcelProps.manifest;
  delete parcelProps.sandbox;
  delete parcelProps.loading;
  delete parcelProps.entry;
  delete parcelProps.container;
  delete parcelProps.logger;
  // @ts-ignore
  delete parcelProps.env;
  // @ts-ignore
  delete parcelProps.dependencies;

  return parcelProps;
}

const Application: React.FC<IProps> = (props: IProps) => {
  const { sandbox, name, loading, style, className, consoleConfig } = props;
  const [mounted, setMounted] = useState(false);
  const [app, setApp] = useState<MicroApplication | null>(null);
  const appRef = useRef(null);

  useEffect(() => {
    (async () => {
      const app = await createMicroApp({
        ...props,
        container: appRef.current,
        props: getProps(props)
      }, { sandbox });

      if (app.context && app.context.baseFrame) {
        // @ts-ignore
        app.context.baseFrame.contentWindow.ALIYUN_CONSOLE_CONFIG = consoleConfig;
      }

      await app.load();
  
      // @ts-ignore
      await app.mount(appRef.current, {
        customProps: getProps(props)
      });

      setMounted(true);
      setApp(app);
    })();

    return () => {
      app && app.unmount();
    };
  });

  if (app) {
    app.update(getProps(props));
  }

  return (<>
    { !mounted && <Loading microAppContainer={name} loading={loading}/> }
    {
      (sandbox && sandbox !== true && sandbox.disableFakeBody) 
      ? React.createElement(name, { style, className, ref: appRef, dataId: name } ) 
      : React.createElement(
        name,
        { children: React.createElement('div', { ref: appRef }) }
      )
    }
  </>
  )
}


export function createAlfaApp<T = any>(option: AlfaFactoryOption) {
  const { name, loading, manifest } = option;

  if (isSSR()) {
    return createIsomorphicAlfaApp(option);
  }

  const AlfaApp = lazy(async () => {
    let resolvedManifest = manifest;
    if (!manifest) {
      resolvedManifest = await getManifest(option);
    }

    // @ts-ignore
    let consoleConfig = window.ALIYUN_CONSOLE_CONFIG || {};
    if (option.dynamicConfig) {
      consoleConfig = await getConsoleConfig(option, consoleConfig);
    }

    const AlfaApp: React.FC<IProps> = (props: IProps) => {
      return (
        <Application
          manifest={resolvedManifest}
          {...props}
          name={normalizeName(name)}
          consoleConfig={consoleConfig}
        />
      )
    }
    return { default: AlfaApp }
  });

  return (props: T) => (
    <ErrorBoundary {...props}>
      <Suspense fallback={<Loading microAppContainer={normalizeName(name)} loading={loading}/>}>
        <AlfaApp
          {...option}
          deps={option.dependencies || {}}
          {...props}
        />
      </Suspense>
    </ErrorBoundary>
  )
}

export { AlfaFactoryOption } from './types';
