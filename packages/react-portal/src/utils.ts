import React, { useEffect } from 'react';
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

const updateHistory = (history: History, path: string) => {
  if (!history) {
    return;
  }
  if (path && path !== location.href) {
    history.push(path);
  }
}

/**
 * Sync route with children
 * @param Comp 
 * @param history 
 */
export const withSyncHistory = (Comp: React.ComponentClass | React.SFC, history: History) => {
  const Wrapper: React.SFC<IProps> = (props: IProps) => {
    const { path } = props;
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
export const withCompatibleSyncHistory = (Comp: React.ComponentClass | React.SFC, history: History) => {
  
  const WrapperComp = (props: IProps) => React.createElement(Wrapper, {
    Comp: Comp,
    history: history,
    props,
  });
  return WrapperComp
}