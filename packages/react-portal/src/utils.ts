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

export const withSyncHistory = (Comp: React.ComponentClass | React.SFC, history: History) => {
  const Wrapper: React.SFC<IProps> = (props: IProps) => {
    const { path } = props;

    useEffect(() => {
      if (!history) {
        return;
      }

      if (path && path !== location.href) {
        history.push(path);
      }
    }, [path]);

    return React.createElement(Comp, props);
  }

  Wrapper.displayName = `withSyncHistory(${Comp.displayName})`
  return Wrapper;
}