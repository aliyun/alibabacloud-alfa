import React from 'react';
import { BaseLoader } from '@alicloud/alfa-core';

import ErrorBoundary from './components/ErrorBoundary';
import { AlfaFactoryOption } from './types';
import createApplication from './createApplication';
import beforeResolveHook from './hooks/beforeResolveHook';
import beforeLoadHook from './hooks/beforeLoadHook';

const loader = BaseLoader.create();

loader.beforeResolve.use(beforeResolveHook);
loader.beforeLoad.use(beforeLoadHook);

const Application = createApplication(loader);

function createAlfaApp<P = any>(option: AlfaFactoryOption) {
  const { name, dependencies } = option || {};

  // check app option
  if (!name) return () => null;

  const passedInOption = option;

  return React.memo((props: P) => {
    const customProps = {
      ...props,
      __injectHistory: props.history,
    };

    return (
      <ErrorBoundary {...props}>
        <Application<P>
          // 兼容历史逻辑，优先使用 option 中的 sandbox 参数
          {...passedInOption}
          sandbox={option.sandbox || (props as P & { sandbox: {} }).sandbox}
          deps={dependencies || {}}
          customProps={customProps}
        />
      </ErrorBoundary>
    );
  });
}

export default createAlfaApp;
