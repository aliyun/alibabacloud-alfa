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
  puppeteer?: boolean;
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
          puppeteer={props.puppeteer}
          basename={props.basename}
          sandbox={option.sandbox || props.sandbox}
          deps={dependencies || {}}
          customProps={customProps}
          // 受控模式下，用于触发子应用随主应用路由变更更新
          path={props.puppeteer ? window.location.toString() : props.path}
        />
      </ErrorBoundary>
    );
  };
}

export default createAlfaApp;
