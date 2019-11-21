import { requireEnsure } from './requireEnsure';
import { hook } from './hook';
import { IBundleOption } from './type';

/**
 * Load bundle for url
 * @param {IBundleOption} option loader option
 * @returns {Promise<T>} module exports
 */
export async function loadBundle<T>(option: IBundleOption) {
  /**
   * inject the global hooks for jsonp loader
   * please use webpack-jsonp-loader-plugin to build bundle
   * code will be wrapped as follow:
   *  window.__CONSOLE_OS_GLOBAL_HOOK__(function(require, module, exports, { dependencies }){ / wepback build umd code /})
   */
  if (!window.__CONSOLE_OS_GLOBAL_HOOK__) {
    window.__CONSOLE_OS_GLOBAL_HOOK__ = hook;
  }

  return await requireEnsure<T>(option);
}
