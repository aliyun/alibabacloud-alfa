import { isFunction } from 'lodash';
import { BundleResolver } from './type';
import { Module, globalModule } from './module';

/**
 * inject the global hooks for jsonp loader
 * 
 * @param {string} id module Id
 * @param {BundleResolver} resolver bundle entry
 */
export const hook = (id: string, resolver: BundleResolver) => {
  if (id && resolver) {
    const chunkRecord = Module.record.get(id);

    const module = Module.resolveModule(id);
    try {
      let context = chunkRecord.context;
      if (isFunction(chunkRecord.context)) {
        context = context({id});
      }

      if (chunkRecord.deps) {
        Object.entries(chunkRecord.deps).forEach(([depsName, exports]) => {
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