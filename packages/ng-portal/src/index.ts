import singleSpaAngular from 'single-spa-angular';
import { EventEmitter } from '@alicloud/console-os-events';

interface BootstrapOptions {
  NgZone: any;
  bootstrapFunction(props: any): Promise<any>;
  template: string;
  Router?: any;
  domElementGetter?(): HTMLElement;
  AnimationEngine?: any;
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

export const bootstrap = (options: BootstrapOptions) => {
  // @ts-ignore
  if (window.__IS_CONSOLE_OS_CONTEXT__) {
    const lifecycles = singleSpaAngular(options);
    return {
      bootstrap: [lifecycles.bootstrap],
      mount: [
        (props) => {
          const { emitter } = getProps(props);
          bindEvents(emitter);
          return lifecycles.mount(props)
        }
      ],
      unmount: [
        (props) => {
          const { emitter } = getProps(props);
          unbindEvents(emitter);
          return lifecycles.mount(props)
        }
      ],
      update: []
    };
  } else {
    return options.bootstrapFunction({});
  }
}
