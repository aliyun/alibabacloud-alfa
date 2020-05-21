/**
 * Window.js
 */
import { addEventListener, removeEventListener } from './events';

class Window {
  constructor( options = {}, context, frame ){
    const externals = options.externals || [];
    const __CONSOLE_OS_GLOBAL_VARS_ = {};
    return new Proxy( frame.contentWindow, {
      set( target, name, value ){
        target[ name ] = value;
        __CONSOLE_OS_GLOBAL_VARS_[ name ] = value
        return true;
      },

      get( target, name ){
        if( externals.includes( name ) ){
          return window[ name ];
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

        if( typeof target[ name ] === 'function' && /^[a-z]/.test( name ) ){
          return target[ name ].bind && target[ name ].bind( target );
        }else{
          return target[ name ];
        }
      }
    } );
  }
}

export default Window;