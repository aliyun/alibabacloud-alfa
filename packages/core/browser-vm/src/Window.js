/**
 * Window.js
 */
import { addEventListener, removeEventListener } from './events';
import { isConstructable, isBoundedFunction } from './utils/common';

const globalFnName = ['setTimeout', 'setInterval', 'clearInterval', 'clearTimeout'];
const defaultExternals = [
  'requestAnimationFrame',
  'webkitRequestAnimationFrame',
  'mozRequestAnimationFrame',
  'oRequestAnimationFrame',
  'msRequestAnimationFrame',
  'cancelAnimationFrame',
  'webkitCancelAnimationFrame',
  'mozCancelAnimationFrame',
  'oCancelAnimationFrame',
  'msCancelAnimationFrame',
];

// 1. if var in externals, read it from cache or window
// 2. if var in hack list, read it from iframe's window
// 3. if var in cache which wrote by micro app, read it from cache
// 4. if var is native, read it from window
// 5. otherwise return undefined
class Window {
  constructor(options = {}, context, frame) {
    const externals = [
      ...defaultExternals,
      ...(options.externals || []),
    ];

    const cache = {};

    const __CONSOLE_OS_GLOBAL_VARS_ = new Proxy(frame.contentWindow, {
      set(target, name, value) {
        cache[name] = value;
        return true;
      },

      // eval will lose it context in with
      has(target, name) {
        if (name === 'eval') return false;
        return name in target;
      },

      get(target, name) {
        if (externals.includes(name)) {
          if (name in cache) return cache[name];

          const windowValue = window[name];
          if (typeof windowValue === 'function' && !isBoundedFunction(windowValue) && !isConstructable(windowValue)) {
            const bindFn = windowValue.bind(window);
            for (const key in windowValue) {
              bindFn[key] = windowValue[key];
            }
            return bindFn;
          } else {
            return windowValue;
          }
        }

        // hack
        switch (name) {
          case 'window':
            return __CONSOLE_OS_GLOBAL_VARS_;
          case 'document':
            return context.document;
          case 'location':
            return context.location;
          case 'history':
            return context.history;
          case '__CONSOLE_OS_GLOBAL_VARS_':
            return __CONSOLE_OS_GLOBAL_VARS_;
          case 'addEventListener':
            return addEventListener(context);
          case 'removeEventListener':
            return removeEventListener(context);
        }

        if (name in cache) {
          return cache[name];
        }

        // target has it when it is native
        if (name in target) {
          const value = window[name];
          if (typeof value === 'function' && !isBoundedFunction(value) && !isConstructable(value)) {
            return value.bind && value.bind(window);
          }
          return value;
        }

        return undefined;
      },
    });

    globalFnName.forEach((name) => {
      if (externals.includes(name)) {
        return;
      }
      __CONSOLE_OS_GLOBAL_VARS_[name] = frame.contentWindow[name].bind(frame.contentWindow);
    });

    return __CONSOLE_OS_GLOBAL_VARS_;
  }
}

export default Window;
