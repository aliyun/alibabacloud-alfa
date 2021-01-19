/**
 * Window.js
 */
import { addEventListener, removeEventListener } from './events';

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

class Window {
  constructor( options = {}, context, frame ){
    const externals = [
      ...defaultExternals,
      ...(options.externals || [])
    ];
    const __CONSOLE_OS_GLOBAL_VARS_ = {};

    globalFnName.forEach((name) => {
      if (externals.includes(name)) {
        return;
      }
      __CONSOLE_OS_GLOBAL_VARS_[name] = frame.contentWindow[name].bind(frame.contentWindow);
    })

    return new Proxy(frame.contentWindow, {
      set( target, name, value ){
        target[ name ] = value;
        __CONSOLE_OS_GLOBAL_VARS_[ name ] = value
        return true;
      },

      get( target, name ){
        if (externals.includes(name)){
          if (typeof window[ name ] === 'function' && /^[a-z]/.test(name)){
            return window[name].bind && window[name].bind(window);
          } else {
            return window[name];
          }
        }

        switch( name ){
          case 'document':
            return context.document;
          case 'location':
            return context.location;
          case 'history':
            return context.history;
          case '__CONSOLE_OS_GLOBAL_VARS_':
            return __CONSOLE_OS_GLOBAL_VARS_;
          case 'addEventListener':
            return addEventListener(context)
          case 'removeEventListener':
            return removeEventListener(context)
        }

        if (__CONSOLE_OS_GLOBAL_VARS_[name]) {
          return __CONSOLE_OS_GLOBAL_VARS_[name];
        }

        if (typeof target[ name ] === 'function' && /^[a-z]/.test(name)){
          return target[name].bind && target[name].bind(target);
        } else {
          return target[name];
        }
      }
    } );
  }
}

export default Window;