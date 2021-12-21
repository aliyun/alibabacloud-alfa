import React, { useContext } from 'react';

import { renderToString, IIsomorphicEnvironment } from '@alicloud/alfa-core';
import { AlfaFactoryOption } from '../types';
import EnvContext from '../context';
import ErrorBoundary from '../components/ErrorBoundary';
import Loading from '../components/Loading';

const App = (props: any) => {
  const env = useContext(EnvContext);

  // 如果 env 为空，则返回 loading 
  if (!env?.getJson || !env?.fetchBundle || !env?.getBundle || !env?.fetchJsonResource)  {
    return <Loading loading={props.loading}/>;
  }

  // get server render string
  const renderString = renderToString(props, env as IIsomorphicEnvironment);

  if (!renderString) {
    return <Loading loading={props.loading}/>;
  }

  return (
    <div
      dangerouslySetInnerHTML={{__html: renderString}}
    />
  );
}

export function createIsomorphicAlfaApp<T = any>(option: AlfaFactoryOption) {
  return (props: T) => (
    <ErrorBoundary {...props}>
      <App {...{...props, ...option}} />
    </ErrorBoundary>
  )
}