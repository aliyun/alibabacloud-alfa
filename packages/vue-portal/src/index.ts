import Vue from 'vue';
import singleSpaVue from './singleSpaVue';
import { EventEmitter } from '@alicloud/console-os-events';

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
  return appProps || {};
};


export const mount = (option) => {
  const el = option.el;
  delete option.el;
  // @ts-ignore
  if (window.__IS_CONSOLE_OS_CONTEXT__) {
    const spaInstance = singleSpaVue({
      appOptions: option,
    });
    return {
      bootstrap: [spaInstance.bootstrap],
      mount: [(props) => {
        const { emitter } = getProps(props);
        bindEvents(emitter);
        return spaInstance.mount(props)
      }],
      unmount: [(props) => {
        const { emitter } = getProps(props);
        unbindEvents(emitter);
        return spaInstance.mount(props)
      }],
      update: [spaInstance.update],
    }
  }
  return new Vue({
    ...option,
    el
  });
}
