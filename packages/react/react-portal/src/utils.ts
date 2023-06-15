import React, { useContext, useEffect, useRef } from 'react';
import { Context } from './Context';
import { History } from 'history';

declare global {
  interface Window {
    __IS_CONSOLE_OS_CONTEXT__: boolean;
  }
}

/**
 * kernel 会为沙箱 context 注入 __IS_CONSOLE_OS_CONTEXT__
 */
declare let context: {
  __IS_CONSOLE_OS_CONTEXT__: boolean;
};

/**
 * @deprecated
 * 判断是否在微应用环境，实现上有问题，请不要再使用
 * @returns
 */
export const isOsContext = (): boolean => {
  return window.__IS_CONSOLE_OS_CONTEXT__;
};

/**
 * 判断是否作为微应用的 jsBundle 加载
 */
export const isOsBundle = (): boolean => {
  try {
    return context.__IS_CONSOLE_OS_CONTEXT__;
  } catch (e) {
    // 降级
    return window.__IS_CONSOLE_OS_CONTEXT__;
  }
};

interface IProps extends React.Attributes {
  history?: History;
  emitter?: any;
  path?: string;
  id?: string;
  [key: string]: any;
}

export const getPathNameWithQueryAndSearch = () => {
  return location.href.replace(/^.*\/\/[^/]+/, '');
};

export const removeHash = (path: string) => {
  return path.replace(/^\/?#/, '');
};

let isFirstEnter = true;

const updateHistory = (history: History, path: string) => {
  if (!history) {
    return;
  }

  if (path && path !== getPathNameWithQueryAndSearch()) {
    // 移除 hash 前缀，避免 react-router history 无法识别
    const realPath = removeHash(path);

    // 防止第一次渲染发生 redirect 时修改 path 导致再次进入重定向逻辑, <Redirect /> 只在 onmount 时才会修改路由
    // 故而重复渲染 <Redirect /> 是无效的
    if (isFirstEnter && history.action === 'REPLACE') {
      setTimeout(() => {
        history.push(realPath);
      }, 0);
    } else {
      history.push(realPath);
    }
  }
};

/**
 * Sync route with children
 * @param Comp
 * @param history
 */
export const withSyncHistory = (Comp: React.ComponentClass | React.FC, history: History) => {
  // 这里不能做 memo，不然会导致相同的 props 无法透传下去
  const Wrapper: React.FC<IProps> = (props: IProps) => {
    const { path, syncHistory, __innerStamp } = useContext(Context).appProps || {};
    // 上一次同步的 path
    const prevSyncPath = useRef('');
    const innerStamp = useRef('');

    useEffect(() => {
      /**
       * 开启路由同步时，强制更新 history，避免微应用内部路由改变后，主应用再次跳转初始路径时不生效
       */
      if (prevSyncPath.current === path && !syncHistory) return;

      // innerStamp 没有变化，说明更新不是由主应用触发，跳过路由同步逻辑
      if (__innerStamp && innerStamp.current === __innerStamp) return;

      prevSyncPath.current = path;
      innerStamp.current = __innerStamp;
      updateHistory(history, path);
      isFirstEnter = false;
    });

    useEffect(() => {
      return () => {
        // reset isFirstEnter when unmount
        isFirstEnter = true;
      };
    });

    return React.createElement(Comp, props);
  };
  Wrapper.displayName = `withSyncHistory(${Comp.displayName})`;
  return Wrapper;
};


export class Wrapper extends React.Component<IProps> {
  static displayName = 'withSyncHistory';

  componentDidMount() {
    const { history } = this.props;
    updateHistory(history, this.props.path);
  }

  componentDidUpdate(preprops) {
    const { history } = this.props;
    if (this.props.path != preprops.path) {
      updateHistory(history, this.props.path);
    }
  }

  render() {
    const { Comp } = this.props;
    return React.createElement(Comp, this.props);
  }
}

/**
 * Sync route with children Compatible with react15
 * @param Comp
 * @param history
 */
export const withCompatibleSyncHistory = (Comp: React.ComponentClass | React.FC, history: History) => {
  const WrapperComp = (props: IProps) => React.createElement(Wrapper, {
    Comp,
    history,
    props,
  });
  return WrapperComp;
};
