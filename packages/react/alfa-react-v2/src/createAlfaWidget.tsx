import React, { useMemo } from 'react';
import LazyLoad from 'react-lazyload';
import { BaseLoader } from '@alicloud/alfa-core';

import ErrorBoundary from './components/ErrorBoundary';
import { createCWSWidget } from './widget';
import { AlfaFactoryOption } from './types';
import createApplication from './createApplication';
import beforeResolveHook from './loaders/beforeResolveHook';
import beforeLoadHook from './loaders/beforeLoadHook';
import Loading from './components/Loading';
import { IS_SSR } from './utils';
import type { IApplicationCustomProps } from './createApplication';

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

type IProps = Omit<IApplicationCustomProps, 'consoleBase' | 'path' | 'appConfig'>;

const Application = createApplication(loader);

function createAlfaWidget<P = any>(option: AlfaFactoryOption): React.FC<any> {
  const {
    name, dependencies, priority = 'medium', dynamicConfig,
    manifest, loading, lazyLoad, delay, sandbox,
  } = option || {};

  if (name.match(/@ali\/widget-/)) {
    // TODO load style
    return createCWSWidget<P>(option);
  }

  // check app option
  if (!name) return () => null;

  let register: (() => Promise<any>) | undefined;
  // createAlfaWidget 创建的组件是否已经初始化
  // 通过该变量判断是否还需要预加载
  let initialized = false;

  const passedInOption = {
    ...option,
    noCache: true,
    deps: dependencies || {},
    sandbox: { ...sandbox, sandBoxUrl: 'about:blank' },
    dynamicConfig: typeof dynamicConfig === 'boolean' ? dynamicConfig : !manifest,
  };

  const createRegister = () => {
    const p = loader.register({
      ...passedInOption,
      // 临时设置 container，否则沙箱会创建插入一个新的 body
      container: document.body,
    });

    return async () => p;
  };

  // 创建延时函数
  const createDelayPromise = () => {
    if (typeof delay === 'number') {
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          resolve();
        }, delay);
      });
    }

    if (typeof delay === 'function') {
      const fnReturn = delay();
      if (typeof fnReturn.then === 'function') return fnReturn;
      if (typeof fnReturn === 'number') return fnReturn;
    }

    return undefined;
  };

  if (priority === 'high' && !IS_SSR) {
    register = createRegister();
  }

  if (priority === 'medium' && !IS_SSR) {
    // 默认优先级下，空闲时会去预加载微应用，而不是等待加载完成
    if (typeof requestIdleCallback === 'function') {
      requestIdleCallback(() => {
        if (register || initialized) return;

        register = createRegister();
      });
    } else {
      setTimeout(() => {
        if (register || initialized) return;

        register = createRegister();
      }, 0);
    }
  }

  const useDelay = () => {
    return useMemo(createDelayPromise, []);
  };

  if (priority === 'low' && !IS_SSR) {
    return (props: P & IProps) => {
      const delayPromise = useDelay();

      // Compatible with old logic
      // props should not passed in errorBoundary
      return (
        <LazyLoad
          placeholder={<Loading loading={loading} />}
          {...{ ...lazyLoad }}
        >
          <ErrorBoundary {...props}>
            <Application
              {...passedInOption}
              delayPromise={delayPromise}
              style={props.style || passedInOption.style}
              deps={dependencies || {}}
              customProps={{ ...props }}
              // 低优先级下，不预加载
              preLoader={undefined}
            />
          </ErrorBoundary>
        </LazyLoad>
      );
    };
  }

  return (props: P & IProps) => {
    const delayPromise = useDelay();

    initialized = true;

    // Compatible with old logic
    // props should not passed in errorBoundary
    return (
      <ErrorBoundary {...props}>
        <Application
          {...passedInOption}
          delayPromise={delayPromise}
          style={props.style || passedInOption.style}
          deps={dependencies || {}}
          customProps={{ ...props }}
          preLoader={register}
        />
      </ErrorBoundary>
    );
  };
}

export function createAlfaWidgetSingleton(option: AlfaFactoryOption) {
  return createAlfaWidget({
    ...option,
    noCache: true,
    sandbox: {
      sandBoxUrl: 'about:blank',
    },
  });
}

/**
 * create memorized app in react function component, just create App after first mounted
 * @param option
 * @returns
 */
export function useAlfaWidget<P = any>(option: AlfaFactoryOption, deps?: any[]) {
  const App = useMemo(() => createAlfaWidget<P>(option), deps || [option?.name, option?.version]);

  return App;
}

export default createAlfaWidget;
