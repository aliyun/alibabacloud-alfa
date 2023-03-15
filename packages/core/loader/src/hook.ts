import isFunction from 'lodash/isFunction';
import { BundleResolver } from './type';
import { Record, Module, globalModule } from './module';

const getContext = (id: string, chunkRecord: Record) => {
  let { context } = chunkRecord;
  if (isFunction(chunkRecord.context)) {
    context = context({ id });
  }
  return context;
};

let preHook = null;

/**
 * 在前面加载的模块系统中寻找模块
 */
const findModuleInParent = (id: string, resolver: BundleResolver) => {
  // remove !preHook.standalone
  if (preHook) {
    preHook(id, resolver);
  } else if ((window as { __IS_CONSOLE_OS_CONTEXT__?: boolean }).__IS_CONSOLE_OS_CONTEXT__) {
    // 如果子应用开启代码分片，分片代码会在沙箱环境下运行，导致此时 hook 执行时由于没有加载记录而失败
    // 所以需要到沙箱外层去查找
    window.parent.__CONSOLE_OS_GLOBAL_HOOK__(id, resolver);
  }
};

/**
 * 脚本类型的模块加载，这里是为了那些没导出，但是需要被沙箱 wrap 的脚本
 */
const resolveExternalScript = (id: string, resolver: BundleResolver, scriptRecord: Record<any>) => {
  try {
    const context = getContext(id, scriptRecord);
    resolver.call(context.window, undefined, undefined, undefined, { ...context });
    Module.record.delete(`${id}_scripts_`);
    scriptRecord.loaded = true;
    scriptRecord.resolve();
  } catch (e) {
    scriptRecord.reject(e);
  }
};

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

    // 做循环加载，如果子模块中需要加载某个模块优先去父模块去找
    if (!chunkRecord && !scriptRecord) {
      // 为了防止一个 ConsoleOS 子应用作为容器单独加载的时候，__CONSOLE_OS_GLOBAL_HOOK__ 为空函数的问题
      return findModuleInParent(id, resolver);
    }

    // 为了在沙箱中加载前置脚本
    if (scriptRecord) {
      return resolveExternalScript(id, resolver, scriptRecord);
    }

    // 如果不存在这个模块的记录，则直接返回
    if (!chunkRecord) {
      return;
    }

    // 处理模块
    const module = globalModule.resolveModule(id);

    try {
      let context = getContext(id, chunkRecord);

      // 如果有前置的依赖，则把前置的依赖注册到当前的模块系统中去
      if (chunkRecord.deps) {
        Object.entries(chunkRecord.deps).forEach(([depsName, exports]) => {
          // Check the deps undefined
          if (!exports) {
            console.warn(`${depsName} is null or undefined, please check the import statement for ${depsName}`);
          }
          const dep = module.resolveModule(depsName);
          dep.exports = exports;
        });
      }

      module.resolver = resolver;
      context = context || globalModule.context;
      module.context = context;

      resolver(module.require, module, module.exports, { ...context });

      chunkRecord.resolve(chunkRecord);
    } catch (e) {
      chunkRecord.reject(e);
    }

    chunkRecord.loaded = true;
  }
};

/**
 * inject the global hooks for jsonp loader
 * please use webpack-jsonp-loader-plugin to build bundle
 * code will be wrapped as follow:
 *  window.__CONSOLE_OS_GLOBAL_HOOK__(id, function(require, module, exports, { dependencies }){ / wepback build umd code /})
 */
if (typeof document !== 'undefined') { // only cache pre hooks in browser environment
  if (window.__CONSOLE_OS_GLOBAL_HOOK__) {
    preHook = window.__CONSOLE_OS_GLOBAL_HOOK__;
  }

  window.__CONSOLE_OS_GLOBAL_HOOK__ = hook;
}
