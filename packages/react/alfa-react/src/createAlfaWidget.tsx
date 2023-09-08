import React, { useMemo } from 'react';
import { BaseLoader } from '@alicloud/alfa-core';

import ErrorBoundary from './components/ErrorBoundary';
import { createCWSWidget } from './widget';
import { AlfaFactoryOption } from './types';
import createApplication from './createApplication';
import beforeResolveHook from './hooks/beforeResolveHook';
import beforeLoadHook from './hooks/beforeLoadHook';

const loader = BaseLoader.create();

loader.beforeResolve.use(beforeResolveHook);
loader.beforeLoad.use(beforeLoadHook);
loader.beforeLoad.use(async (appConfig) => {
  const { app } = appConfig;

  if (app && app.context) {
    // disable history
    (app.context.history as any) = {};
  }

  return appConfig;
});

interface IProps {
  /**
   * 处理外跳链接
   * @param url
   * @returns
   */
  handleExternalLink?: (url: string) => void;
  /**
   * 根节点样式
   */
  style?: React.CSSProperties;
}

const Application = createApplication(loader);

function createAlfaWidget<P = any>(option: AlfaFactoryOption) {
  const { name, dependencies } = option || {};

  if (name.match(/@ali\/widget-/)) {
    // TODO load style
    return createCWSWidget<P>(option);
  }

  // check app option
  if (!name) return () => null;

  const passedInOption = option;

  return (props: P & IProps) => (
    // Compatible with old logic
    // props should not passed in errorBoundary
    <ErrorBoundary {...props}>
      <Application
        {...passedInOption}
        // name={name}
        style={props.style || passedInOption.style}
        deps={dependencies || {}}
        customProps={{ ...props }}
      />
    </ErrorBoundary>
  );
}

/**
 * create memorized app in react function component, just create App after first mounted
 * @param option
 * @returns
 */
export function useAlfaWidget<P = any>(option: AlfaFactoryOption) {
  const App = useMemo(() => createAlfaWidget<P>(option), []);

  return App;
}

export default createAlfaWidget;
