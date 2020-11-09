import React, { Suspense, lazy, useRef, useEffect, useState } from 'react';

import { getManifest, createMicroApp } from '@alicloud/alfa-core'
import { IProps } from './base';
import Loading from './components/Loading';
import { AlfaFactoryOption } from './types';
import ErrorBoundary from './components/ErrorBoundary';
import { normalizeName } from './utils';

const Application: React.FC<IProps> = (props: IProps) => {
  const { sandbox, name, loading, style, className } = props;
  const [mounted, setMounted] = useState(false);
  const appRef = useRef(null);

  useEffect(() => {
    (async () => {
      const app = await createMicroApp({
        ...props
      }, { sandbox })

      await app.load()
  
      await app.mount(appRef.current, {});

      setMounted(true);

      return () => {
        app.unmount();
      };
    })()
  });
  const elementTagName = normalizeName(name);

  return (<>
    { !mounted && <Loading loading={loading}/> }
    {
      (sandbox && sandbox !== true && sandbox.disableFakeBody) 
      ? React.createElement(elementTagName, { style, className, ref: appRef } ) 
      : React.createElement(
        elementTagName,
        React.createElement('div', { ref: appRef })
      )
    }
  </>
  )
}


export function createAlfaApp<T = any>(option: AlfaFactoryOption) {
  const { name, loading } = option;
  const AlfaApp = lazy(async () => {
    const manifest = await getManifest(option);
    const AlfaApp: React.FC<IProps> = (props: IProps) => {
      return (
        <Application
          {...props}
          id={name.replace('@ali/', '')}
          manifest={manifest}
        />
      )
    }
    return { default: AlfaApp }
  });

  return (props: T) => (
    <ErrorBoundary>
      <Suspense fallback={<Loading loading={loading}/>}>
        <AlfaApp
          {...option}
          {...props}
        />
      </Suspense>
    </ErrorBoundary>
  )
}

export { AlfaFactoryOption } from './types';