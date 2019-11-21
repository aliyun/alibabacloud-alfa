import React from 'react';
import ReactDOM from 'react-dom';
import SingleSpaReact from 'single-spa-react';
import { EventEmitter } from '@alicloud/console-os-events'

import { isOsContext } from './utils';
import { Context } from './Context';
import { IContextProps } from './types';
import ErrorBoundary from './ErrorBoundary';

interface EmitterProps {
  emitter: EventEmitter;
}

interface IProps {
  customProps: EmitterProps;
  appProps: EmitterProps;
}

const bindEvents = (emitter: EventEmitter) => {
  emitter.on('main:postMessage', (data: any) => {
    window.postMessage(data.data, null);
  })
}

const getProps = (props: IProps) => {
  return props.customProps || props.appProps;
}

export function mount<T = any>(App: new() => React.Component<T & EmitterProps, any>, container: Element, id: string) {

  class ConsoleApp extends React.Component<T & IProps> {
    public componentDidCatch() {
      // Empty
    }

    public componentDidMount() {
      const props = getProps(this.props);
      if (!props) {
        return;
      }
      const { emitter } = props;
      bindEvents(emitter)
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
