import React, { useContext, useEffect } from 'react';
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

let isFirstEnter = true;

const updateHistory = (history: History, path: string) => {
  if (!history) {
    return;
  }
  if (path && path !== getPathNameWithQueryAndSearch()) {
    // 防止还没发生 第一渲染 破坏 path 的状态
    if (isFirstEnter) {
      setTimeout(() => {
        history.push(path);
      }, 0);
    } else {
      history.push(path);
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
    const { path } = useContext(Context).appProps || {};
    useEffect(() => {
      updateHistory(history, path);
      isFirstEnter = false;
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
