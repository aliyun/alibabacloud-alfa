import isFunction from 'lodash/isFunction';
import { BundleResolver } from './type';
import { Module, globalModule } from './module';
import { Record } from './module/Record';


const getContext = (id: string, chunkRecord: Record) => {
  let context = chunkRecord.context;
  if (isFunction(chunkRecord.context)) {
    context = context({id});
  }
  return context
}

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
    const scriptRecord = Module.record.get(`${id}_scripts_`);
    if (!chunkRecord && !scriptRecord) {
      preHook && preHook(id, resolver);

      // when a page contains two consoleos runtime
      // using __CONSOLE_OS_WHITE_LIST__ to invoke app directly
      // rather than render by another consoleos runtime
      if (!preHook
        && window.__CONSOLE_OS_WHITE_LIST__
        && window.__CONSOLE_OS_WHITE_LIST__.indexOf(id) !== -1) {
        window.__CONSOLE_OS_GLOBAL_VARS_ || (window.__CONSOLE_OS_GLOBAL_VARS_ = {});
        resolver.call(this, undefined, undefined, undefined, { window, location, history, document })
      }
      return;
    }

    if (scriptRecord) {
      try {
        const context = getContext(id, scriptRecord);
        resolver.call(context.window, undefined, undefined, undefined, { ...context });
        Module.record.delete(`${id}_scripts_`);
        scriptRecord.loaded = true;
        scriptRecord.resolve();
      } catch(e) {
        scriptRecord.reject(e);
      }
      return;
    }

    const module = Module.resolveModule(id);
    try {
      let context = getContext(id, chunkRecord);
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
      resolver(module.require, module, module.exports, { ...context })
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