import createLogger from '@alicloud/console-logger-sls';

import { AlfaLogger } from '../types';

const logger = createLogger({
  project: 'alfa',
  endpoint: 'cn-wulanchabu.log.aliyuncs.com', // project_xx 的外网域名，在 SLS project 概览里可以找到
  logstore: 'loader', // 日志落库的地方
  defaultParams: {
    LOADER_VERSION: '',
    START_TIME: '',
    END_TIME: '',
    NAME: '',
    TYPE: '', // app or widget
    ENV: '',
  }, // 默认参数，对象（静态）或方法（动态）
});

interface Params {
  [key: string]: string | number | boolean;
}

export default class Logger implements AlfaLogger {
  cache: Params;
  caches: Params[];
  context: Params;

  constructor(context: Params = {}) {
    this.cache = {};
    this.caches = [];
    this.context = context;
  }

  set(params: Params) {
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
    logger.log('ALFA_LOADER', this.cache);
    this.caches.push({ ...this.context, ...this.cache });
    this.cache = {};
  }

  info(params: Params) {
    logger.info('ALFA_INFO', { ...this.context, ...params });
  }

  debug(params: Params) {
    console.log('ALFA_DEBUG', { ...this.context, ...params });
    logger.debug('ALFA_DEBUG', { ...this.context, ...params });
  }

  warn(params: Params) {
    logger.error('ALFA_WARN', { ...this.context, ...params });
  }

  error(params: Params) {
    logger.error('ALFA_ERROR', { ...this.context, ...params });
  }
}
