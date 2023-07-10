import React from 'react';
import ReactDOM from 'react-dom';
import SingleSpaReact from 'single-spa-react';
import { EventEmitter } from '@alicloud/console-os-events';

import { getPathNameWithQueryAndSearch, isOsContext } from './utils';
import { Context } from './Context';
import { IContextProps } from './types';
import ErrorBoundary, { Logger } from './ErrorBoundary';

interface EmitterProps extends Record<string, any> {
  emitter?: EventEmitter;
}

interface IProps {
  customProps: EmitterProps;
  appProps: EmitterProps;
  appDidCatch?: (error: Error) => void;
  logger: Logger;
}

const globalEventEmitter = (data: any) => {
  window.postMessage(data.data, '*');
};

const bindEvents = (emitter: EventEmitter) => {
  emitter && emitter.on('main:postMessage', globalEventEmitter);
};

const unbindEvents = (emitter: EventEmitter) => {
  emitter && emitter.off('main:postMessage', globalEventEmitter);
};

const getProps = (props) => {
  const appProps = { ...props, ...(props.appProps || {}) };

  delete appProps.domElement;
  delete appProps.singleSpa;
  delete appProps.mountParcel;

  return appProps || {};
};

type AppComponent<T> = React.ComponentClass<T & EmitterProps, any> | React.FunctionComponent<T & EmitterProps> | string;

const exposeModuleMap: Record<string, any> = {};

export function registerExposedModule(moduleName: string, modules: any) {
  if (exposeModuleMap[moduleName]) {
    console.error('module has been registered in expose module map');
    return;
  }

  exposeModuleMap[moduleName] = modules;
}

export function mount<T extends EmitterProps>(App: AppComponent<T>, container?: Element | null, id?: string, options?: any) {
  class ConsoleApp extends React.Component<T & IProps> {
    constructor(props) {
      super(props);

      // @deprecated
      if (props.__enableInitialHistoryAction && props?.appProps?.path && props?.appProps?.path !== getPathNameWithQueryAndSearch()) {
        window.history.replaceState(null, null, props?.appProps?.path);
      }
    }
    /**
     * 针对 外跳 的路由提供简单的方式通知宿主
     * @param e 点击事件
     */
    private handleExternalLinks = (e: Event) => {
      const target = e.target as HTMLAnchorElement;
      const { emitter, id, name } = getProps(this.props);
      if (target.tagName === 'A' && target.hasAttribute('data-alfa-external-router')) {
        e.preventDefault();
        e.stopPropagation();
        emitter && emitter.emit(`${name || id}:external-router`, target.getAttribute('href'));
      }
    };

    componentDidCatch() { /* Empty */ }

    componentDidMount() {
      const props = getProps(this.props);
      if (!props) { return; }
      const { emitter } = props;
      bindEvents(emitter);

      if (isOsContext()) {
        document.body.addEventListener('click', this.handleExternalLinks, true);
      }
    }

    componentWillUnmount() {
      const { emitter } = getProps(this.props);
      unbindEvents(emitter);

      if (isOsContext()) {
        document.body.removeEventListener('click', this.handleExternalLinks, true);
      }
    }

    render() {
      const props = getProps(this.props);
      const { logger, appDidCatch } = props;
      const contextValue: IContextProps = {
        inOsSandBox: isOsContext(),
        appProps: props,
      };

      return (
        <ErrorBoundary
          logger={logger}
          appDidCatch={appDidCatch}
        >
          { Context ? (
            <Context.Provider value={contextValue}>
              <App {...Object.assign(props || {})} />
            </Context.Provider>
          ) : <App {...Object.assign(props || {})} />
          }
        </ErrorBoundary>
      );
    }
  }

  if (isOsContext()) {
    const reactLifecycles = SingleSpaReact({
      // @ts-ignore
      React,
      ReactDOM,
      rootComponent: ConsoleApp,
      domElementGetter: () => document.getElementsByTagName(id)[0],
    });

    return {
      bootstrap: [
        reactLifecycles.bootstrap,
      ],
      mount: [
        reactLifecycles.mount,
      ],
      unmount: [
        reactLifecycles.unmount,
      ],
      update: [
        reactLifecycles.update,
      ],
      exposedModule: exposeModuleMap,
    };
  } else {
    // @ts-ignore
    ReactDOM.render(<ConsoleApp />, container);
  }
}
