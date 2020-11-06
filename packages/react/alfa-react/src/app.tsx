import React, { Suspense, lazy, useRef, useEffect } from 'react';
import axios from 'axios';

import { getManifest, createMicroApp } from '@alicloud/alfa-core'
import { AlfaFactoryOption } from './types';
import ErrorBoundary from './components/ErrorBoundary';
import Loading from './components/Loading';
import { IProps } from './base';

const Application: React.FC<IProps> = (props: IProps) => {
  const { sandbox, name, loading } = props;
  const appRef = useRef(null);

  useEffect(() => {
    (async () => {
      const app = await createMicroApp({
        ...props
      }, { sandbox })

      await app.load()
  
      await app.mount(appRef.current, {});

      return () => {
        app.unmount();
      };
    })()
  });

  return (<>
    <Loading loading={loading}/>
    {
      (sandbox && sandbox.disableFakeBody) 
      ? React.createElement(name, { style, className, ref: ref } ) 
      : React.createElement(
        name,
        React.createElement('div', { ref: ref })
    }
  </>
  )
}


export function createAlfaApp(option: AlfaFactoryOption) {
  const { loading, name } = option;
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

  return (props: IProps) => (
    <ErrorBoundary>
      <AlfaApp
        {...props}
      />
    </ErrorBoundary>
  )
}

export { AlfaFactoryOption } from './types';