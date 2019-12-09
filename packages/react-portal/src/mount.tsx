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
  const appProps = { ...props };

  delete appProps.domElement;
  delete appProps.singleSpa;
  delete appProps.mountParcel;

  return appProps || {};
};

export function mount<T = any>(App: new() => React.Component<T & EmitterProps, any>, container: Element, id: string) {

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
        <ErrorBoundary logger={this.props.logger}>
          <Context.Provider value={contextValue}>
            <App {...Object.assign(getProps(this.props) || {})} />
          </Context.Provider>
        </ErrorBoundary>
      );
    }
  }

  if (isOsContext()) {
    const reactLifecycles = SingleSpaReact({
      React,
      ReactDOM,
      rootComponent: ConsoleApp,
      domElementGetter: () => document.getElementById(id),
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
