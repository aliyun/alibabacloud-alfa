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
          // @ts-ignore
          return lifecycles.mount(options, props)
        }
      ],
      unmount: [
        (props) => {
          const { emitter } = getProps(props);
          unbindEvents(emitter);
          // @ts-ignore
          if (!options.bootstrappedModule) {
            return Promise.resolve();
          }
          // @ts-ignore
          return lifecycles.unmount(options, props)
        }
      ],
      update: []
    };
  } else {
    return options.bootstrapFunction({});
  }
}
