import React from 'react';
import ReactDOM from 'react-dom';
import SingleSpaReact from 'single-spa-react';
import { EventEmitter } from '@alicloud/console-os-events'

import { isOsContext } from './utils';
import { Context } from './Context';
import { IContextProps } from './types';
import ErrorBoundary, { Logger } from './ErrorBoundary';

interface EmitterProps {
  emitter: EventEmitter;
}

interface IProps {
  customProps: EmitterProps;
  appProps: EmitterProps;
  appDidCatch?: (error: Error) => void;
  logger: Logger;
}

const globalEventEmitter = (data: any) => {
  window.postMessage(data.data, null);
}

const bindEvents = (emitter: EventEmitter) => {
  emitter && emitter.on('main:postMessage', globalEventEmitter);
}

const unbindEvents = (emitter: EventEmitter) => {
  emitter && emitter.off('main:postMessage', globalEventEmitter);
}

const getProps = (props) => {
  const appProps = { ...props, ...(props.appProps || {}) };

  delete appProps.domElement;
  delete appProps.singleSpa;
  delete appProps.mountParcel;

  return appProps || {};
};

type AppComponent<T> = React.ComponentClass<T & EmitterProps, any> | React.FunctionComponent<T & EmitterProps> | string;

export function mount<T = any>(App: AppComponent<T>, container?: Element, id?: string) {
  class ConsoleApp extends React.Component<T & IProps> {
    public componentDidCatch() {/*Empty*/}

    public componentDidMount() {
      const props = getProps(this.props);
      if (!props) {
        return;
      }
      const { emitter } = props;
      bindEvents(emitter)
    }

    public componentWillUnmount() {
      const { emitter } = getProps(this.props);
      unbindEvents(emitter)
    }

    public render () {
      const contextValue: IContextProps = {
        inOsSandBox: isOsContext()
      };

      return (
        <ErrorBoundary 
          logger={this.props.logger}
          appDidCatch={this.props.appDidCatch}
        >
          { Context ? (
            <Context.Provider value={contextValue}>
              <App {...Object.assign(getProps(this.props) || {})} />
            </Context.Provider>
          ) : <App {...Object.assign(getProps(this.props) || {})} />
          }
        </ErrorBoundary>
      );
    }
  }

  if (isOsContext()) {
    const reactLifecycles = SingleSpaReact({
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
        // @ts-ignore
        reactLifecycles.update,
      ]
    }
  } else {
    // @ts-ignore
    ReactDOM.render(<ConsoleApp />, container)
  }
}
