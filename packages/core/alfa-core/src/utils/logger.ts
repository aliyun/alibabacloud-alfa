import createLogger from '@alicloud/console-logger-sls';

import { AlfaLogger } from '../types';

const logger = createLogger({
  project: 'alfa',
  endpoint: 'alfa.log-global.aliyuncs.com', // project_xx 的外网域名，在 SLS project 概览里可以找到
  logstore: 'loader', // 日志落库的地方
});

interface Params {
  [key: string]: string | number | boolean | undefined;
}

enum Method {
  log = 'log',
  info = 'info',
  warn = 'warn',
  error = 'error',
}

export default class Logger implements AlfaLogger {
  cache: Params;
  // caches: Params[];
  context: Params;

  constructor(context: Params = {}) {
    this.cache = {};
    this.context = context;
  }

  setContext(params: Params) {
    this.context = {
      ...this.context,
      ...params,
    };
  }

  record(params: Params) {
    this.cache = {
      ...this.cache,
      ...params,
    };
  }

  send() {
    this.track(Method.log, 'METRIC', this.cache);
    this.cache = {};
  }

  info(params: Params) {
    this.track(Method.info, 'INFO', params);
  }

  debug(params: Params) {
    // do not log debug message in production env
    if (this.context.ENV === 'prod') return;
    // TODO: debug with devtools
    console.log('DEBUG', this.mergeData(params));
  }

  warn(params: Params) {
    this.track(Method.warn, 'WARN', params);
  }

  error(params: Params) {
    this.track(Method.error, 'ERROR', params);
  }

  private mergeData(params: Params) {
    return {
      ...this.context,
      ...params,
    };
  }

  private track(method: Method, topic: string, params: Params) {
    const data = this.mergeData(params);

    // do not track during development
    if (this.context.ENV !== 'prod') {
      console[method](topic, data);
      return;
    }

    logger[method](topic, data);
  }
}
