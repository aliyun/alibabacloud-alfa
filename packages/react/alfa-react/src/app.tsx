import React, { Suspense, lazy, useRef, useEffect, useState } from 'react';

import { getManifest, createMicroApp } from '@alicloud/alfa-core'
import { IProps } from './base';
import Loading from './components/Loading';
import { AlfaFactoryOption, MicroApplication } from './types';
import ErrorBoundary from './components/ErrorBoundary';
import { normalizeName } from './utils';

const Application: React.FC<IProps> = (props: IProps) => {
  const { sandbox, name, loading, style, className } = props;
  const [mounted, setMounted] = useState(false);
  const [app, setApp] = useState<MicroApplication | null>(null);
  const appRef = useRef(null);

  useEffect(() => {
    (async () => {
      const app = await createMicroApp({
        ...props,
        container: appRef.current
      }, { sandbox })

      await app.load();
  
      // @ts-ignore
      await app.mount(appRef.current, {});

      setMounted(true);
      setApp(app);
    })();

    return () => {
      app && app.unmount();
    };
  });

  if (app) {
    app.update(props);
  }

  return (<>
    { !mounted && <Loading loading={loading}/> }
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

  const AlfaApp = lazy(async () => {
    let resolvedManifest = manifest;
    if (!manifest) {
      resolvedManifest = await getManifest(option);
    }

    const AlfaApp: React.FC<IProps> = (props: IProps) => {
      return (
        <Application
          manifest={resolvedManifest}
          {...props}
          name={normalizeName(name)}
        />
      )
    }
    return { default: AlfaApp }
  });

  return (props: T) => (
    <ErrorBoundary {...props}>
      <Suspense fallback={<Loading loading={loading}/>}>
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
