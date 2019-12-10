import isFunction from 'lodash/isFunction';
import { BundleResolver } from './type';
import { Module, globalModule } from './module';

let preHook = null;
/**
 * inject the global hooks for jsonp loader
 * 
 * @param {string} id module Id
 * @param {BundleResolver} resolver bundle entry
 */
export const hook = (id: string, resolver: BundleResolver) => {
  if (id && resolver) {
    const chunkRecord = Module.record.get(id);

    if (!chunkRecord && preHook) {
      return preHook(id, resolver)
    }
    const module = Module.resolveModule(id);
    try {
      let context = chunkRecord.context;
      if (isFunction(chunkRecord.context)) {
        context = context({id});
      }

      if (chunkRecord.deps) {
        // Check the deps undefined
        Object.entries(chunkRecord.deps).forEach(([depsName, exports]) => {
          if (!exports) {
            console.warn(`${depsName} is null or undefined, please check the import statement for ${depsName}`);
          }
          const dep = Module.resolveModule(depsName);
          dep.exports = exports;
        })
      }

      module.resolver = resolver;

      context = context || globalModule.context;
      resolver(module.require, module, module.exports, { ...context });
    } catch(e) {
      chunkRecord.reject(e);
    }
    chunkRecord.loaded = true;
    chunkRecord.resolve(chunkRecord);
  }
};

/**
 * inject the global hooks for jsonp loader
 * please use webpack-jsonp-loader-plugin to build bundle
 * code will be wrapped as follow:
 *  window.__CONSOLE_OS_GLOBAL_HOOK__(function(require, module, exports, { dependencies }){ / wepback build umd code /})
 */
if (window.__CONSOLE_OS_GLOBAL_HOOK__) {
  preHook = window.__CONSOLE_OS_GLOBAL_HOOK__
}

window.__CONSOLE_OS_GLOBAL_HOOK__ = hook;