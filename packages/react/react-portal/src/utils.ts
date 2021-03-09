import React, { useContext, useEffect } from 'react';
import { Context } from './Context';
import { History } from 'history';

declare global {
  interface Window {
    __IS_CONSOLE_OS_CONTEXT__: boolean;
  }
}

export const isOsContext = (): boolean => {
  return window.__IS_CONSOLE_OS_CONTEXT__;
}

interface IProps extends React.Attributes {
  history?: History;
  emitter?: any;
  path?: string;
  id?: string;
  [key: string]: any;
}

const getPathNameWithQueryAndSearch = () => {
  return location.href.replace(/^.*\/\/[^\/]+/, '');
}

const updateHistory = (history: History, path: string) => {
  if (!history) {
    return;
  }
  if (path && path !== getPathNameWithQueryAndSearch()) {
    setTimeout(() => {
      history.push(path);
    }, 0)
  }
}

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
    }, [path]);
    return React.createElement(Comp, props);
  }
  Wrapper.displayName = `withSyncHistory(${Comp.displayName})`
  return Wrapper;
}


export class Wrapper extends React.Component<IProps> {
  public static displayName = `withSyncHistory`;

  public componentDidMount() {
    const { history } = this.props;
    updateHistory(history, this.props.path);
  }

  public componentDidUpdate(preprops) {
    const { history } = this.props;
    if (this.props.path != preprops.path) {
      updateHistory(history, this.props.path);
    }
  }

  public render() {
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
    Comp: Comp,
    history: history,
    props,
  });
  return WrapperComp
}