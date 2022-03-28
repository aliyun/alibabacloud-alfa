import { createMicroApp } from '@alicloud/console-os-kernal';

import { getManifestFromConfig, getURL, getAlfaEnv } from './utils';
import Hook, { ChainPromise, HookHandler } from './utils/hookManager';
import { IAppConfig } from './types';
import Logger from './utils/logger';

const mergeConfig = (appConfig: IAppConfig, logger: Logger): IAppConfig => {
  return {
    ...appConfig,
    env: appConfig.env || getAlfaEnv(),
    logger: appConfig.logger || logger,
  };
};

export default class BaseLoader {
  // just create instance, will be mounted in loader
  static create() {
    return new this();
  }

  beforeResolve: Hook<IAppConfig>;
  afterResolve: Hook<IAppConfig>;
  beforeLoad: Hook<IAppConfig>;
  afterLoad: Hook<IAppConfig>;
  config?: IAppConfig;

  constructor() {
    this.beforeResolve = new Hook<IAppConfig>();
    this.afterResolve = new Hook<IAppConfig>();
    this.beforeLoad = new Hook<IAppConfig>();
    this.afterLoad = new Hook<IAppConfig>();
  }

  async register<P = {}>(passInConfig: IAppConfig<P>) {
    const logger = new Logger();
    if (!passInConfig) {
      logger.error({ E_MSG: 'cannot find config before start.' });
      return Promise.reject(new Error('[alfa-core] cannot find config before start.'));
    }

    this.config = mergeConfig(passInConfig, logger);

    const { name, version, env } = this.config;

    logger.setContext({
      NAME: name,
      VERSION: version,
      ENV: env,
    });

    const chains: Array<ChainPromise<IAppConfig<P>> | undefined> = [];

    const flattenHookHandlers = (handler: HookHandler<IAppConfig<P>>) => {
      const { fulfilled, rejected } = handler;

      chains.push(fulfilled, rejected);
    };

    // resolve entry from config
    this.beforeResolve.handlers.forEach(flattenHookHandlers);

    // TODO: handle beforeResolve error
    chains.push(this.resolve, undefined);

    // modify resolved config
    this.afterResolve.handlers.forEach(flattenHookHandlers);

    chains.push(this.init, undefined);

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

    return promise.catch((e) => { throw e; });
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
   * init config for micro app
   * @param config
   * @returns
   */
  private async init(config: IAppConfig) {
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
      // logger,
    } = config;

    const app = await createMicroApp({
      name,
      dom: container,
      manifest,
      customProps: props,
      deps,
      url,
      // logger,

      appWillMount: beforeMount,
      appDidMount: afterMount,
      appWillUnmount: beforeUnmount,
      appDidUnmount: afterUnmount,
      appWillUpdate: beforeUpdate,
    }, {
      sandbox,
      // parcel
    });

    return {
      ...config,
      app,
    };
  }

  /**
   * loadApp from remote
   * @param config
   * @returns
   */
  private async load(config: IAppConfig) {
    await config?.app?.load();

    return config;
  }
}
