import React, { useMemo } from 'react';
import { BaseLoader } from '@alicloud/alfa-core';

import ErrorBoundary from './components/ErrorBoundary';
import { AlfaFactoryOption } from './types';
import createApplication from './createApplication';
import beforeResolveHook from './hooks/beforeResolveHook';
import beforeLoadHook from './hooks/beforeLoadHook';

import type { IApplicationProps, IApplicationCustomProps } from './createApplication';

const loader = BaseLoader.create();

loader.beforeResolve.use(beforeResolveHook);
loader.beforeLoad.use(beforeLoadHook);

const Application = createApplication(loader);

interface IProps extends IApplicationProps, IApplicationCustomProps {}

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
          style={props.style || passedInOption.style}
          syncHistory={props.syncHistory}
          syncRegion={props.syncRegion}
          syncResourceGroup={props.syncResourceGroup}
          onSyncHistory={props.onSyncHistory}
          basename={props.basename}
          sandbox={option.sandbox || props.sandbox}
          deps={dependencies || {}}
          customProps={customProps}
        />
      </ErrorBoundary>
    );
  };
}

/**
 * create memorized app in react function component,
 * it will update when name or version changed as default
 * @param option
 * @param dep custom useMemo deps
 * @returns
 */
export function useAlfaApp<P = any>(option: AlfaFactoryOption, deps?: any[]) {
  const App = useMemo(() => createAlfaApp<P>(option), deps || [option?.name, option?.version]);

  return App;
}

export default createAlfaApp;
