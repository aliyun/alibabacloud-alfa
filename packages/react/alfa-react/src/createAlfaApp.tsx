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
  sandbox?: Record<string, any>;
  /**
   * 处理外跳链接
   * @param url
   * @returns
   */
  handleExternalLink?: (url: string) => void;
  /**
   * 是否开启路由自动同步，需配合 basename 使用
   */
  syncHistory?: boolean;
  /**
   * 子应用路由前缀
   */
  basename?: string;
  history?: any;
  /**
   * 子应用路由
   */
  path?: string;
  /**
   * 根节点样式
   */
  style?: React.CSSProperties;
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
          style={props.style || passedInOption.style}
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

/**
 * create memorized app in react function component, just create App after first mounted
 * @param option
 * @returns
 */
export function useAlfaApp<P = any>(option: AlfaFactoryOption) {
  const App = useMemo(() => createAlfaApp<P>(option), []);

  return App;
}

export default createAlfaApp;
