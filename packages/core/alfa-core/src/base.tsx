import { createMicroApp } from '@alicloud/console-os-kernal';

import { getManifestFromConfig, getURL } from './utils';
import Hook, { ChainPromise, HookHandler } from './utils/hookManager';
import { IAppConfig } from './types';

export default class BaseLoader {
  // just create instance, will be mounted in loader
  static create() {
    return new this();
  }

  beforeResolve: Hook<IAppConfig>;
  afterResolve: Hook<IAppConfig>;
  beforeLoad: Hook<IAppConfig>;
  afterLoad: Hook<IAppConfig>;
  config: IAppConfig;

  constructor() {
    this.beforeResolve = new Hook<IAppConfig>();
    this.afterResolve = new Hook<IAppConfig>();
    this.beforeLoad = new Hook<IAppConfig>();
    this.afterLoad = new Hook<IAppConfig>();
  }

  async register<P = {}, C = {}>(config: IAppConfig<P> & C) {
    // TODO: check config
    if (!config) return Promise.reject(new Error('[alfa-core] register config is not existed.'));
    this.config = config;

    const chains: Array<ChainPromise<IAppConfig<P> | (IAppConfig<P> & C)>> = [];

    const flattenHookHandlers = (handler: HookHandler<IAppConfig<P> & C>) => {
      const { fulfilled, rejected } = handler;

      chains.push(fulfilled, rejected);
    };

    // resolve entry from config
    this.beforeResolve.handlers.forEach(flattenHookHandlers);

    // TODO: handle beforeResolve error
    chains.push(this.resolve, undefined);

    // modify resolved config
    this.afterResolve.handlers.forEach(flattenHookHandlers);
    // update props before load
    this.beforeLoad.handlers.forEach(flattenHookHandlers);

    // TODO: handle beforeLoad error
    chains.push(this.load, undefined);

    // modify context after load
    this.afterLoad.handlers.forEach(flattenHookHandlers);

    let promise = Promise.resolve(this.config);

    while (chains.length) {
      promise = promise.then(chains.shift(), chains.shift());
    }

    return promise;
  }

  /**
   * resolve config and rewrite manifest and url
   * @param config
   * @returns
   */
  private async resolve(config: IAppConfig) {
    const manifest = getManifestFromConfig(config);
    const url = getURL(config);

    if (!manifest && !url) {
      throw new Error(`No entry or manifest in ${config.name}`);
    }

    return {
      ...config,
      manifest,
      url,
    };
  }

  /**
   * loadApp from remote
   * @param config
   * @returns
   */
  private async load(config: IAppConfig) {
    const {
      name,
      container,
      manifest,
      props,
      deps,
      url,
      beforeMount,
      afterMount,
      beforeUnmount,
      afterUnmount,
      beforeUpdate,
      sandbox,
      logger,
    } = config;

    const app = await createMicroApp({
      name,
      dom: container,
      manifest,
      customProps: props,
      deps,
      url,
      logger,

      appWillMount: beforeMount,
      appDidMount: afterMount,
      appWillUnmount: beforeUnmount,
      appDidUnmount: afterUnmount,
      appWillUpdate: beforeUpdate,
    }, {
      sandbox,
      // parcel
    });

    await app.load();

    return {
      ...config,
      app,
    };
  }
}
