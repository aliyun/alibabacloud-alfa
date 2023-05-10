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

const removeHash = (path: string) => {
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

    // 防止还没发生 第一渲染 破坏 path 的状态
    if (isFirstEnter) {
      setTimeout(() => {
        history.push(realPath);
      }, 0);
    } else {
      history.push(realPath);
    }
  }
  isFirstEnter = false;
};

/**
 * Sync route with children
 * @param Comp
 * @param history
 */
export const withSyncHistory = (Comp: React.ComponentClass | React.FC, history: History) => {
  const Wrapper: React.FC<IProps> = (props: IProps) => {
    const { path, syncHistory } = useContext(Context).appProps || {};
    // 上一次同步的 path
    const prevSyncPath = useRef('');

    useEffect(() => {
      isFirstEnter = false;

      /**
       * 开启路由同步时，强制更新 history，避免微应用内部路由改变后，主应用再次跳转初始路径时不生效
       */
      if (prevSyncPath.current === path && !syncHistory) return;

      /**
      * 开启路由同步后，初始化的 path 可能是无效路径，此时微应用内默认会重定向至兜底页
      * 此时如果再次更新 path，会导致微应用内的 Redirect 逻辑失效（react-router history 逻辑限制，避免死循环），从而跳转到空白页
      * 所以需要在第一次渲染成功后判断 history.action，如果值为 REPLACE 说明初始路径是无效路径发生了重定向，此时不应再更新微应用路由
      */
      if (!prevSyncPath.current && syncHistory && history.action === 'REPLACE') return;

      prevSyncPath.current = path;
      updateHistory(history, path);
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
