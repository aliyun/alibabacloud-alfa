import React, { useMemo } from 'react';
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

interface IProps {
  /**
   * @deprecated
   */
  sandbox: Record<string, any>;
  syncHistory?: boolean;
  basename?: string;
  history?: any;
  path?: string;
}

function createAlfaApp<P = any>(option: AlfaFactoryOption) {
  const { name, dependencies } = option || {};

  // check app option
  if (!name) return () => null;

  const passedInOption = option;

  return (props: P & IProps) => {
    const customProps = useMemo(() => ({
      ...props,
      __injectHistory: props.history,
    }), [props]);

    return (
      <ErrorBoundary {...props}>
        <Application
          // 兼容历史逻辑，优先使用 option 中的 sandbox 参数
          {...passedInOption}
          syncHistory={props.syncHistory}
          basename={props.basename}
          sandbox={option.sandbox || props.sandbox}
          deps={dependencies || {}}
          customProps={customProps}
        />
      </ErrorBoundary>
    );
  };
}

export default createAlfaApp;
