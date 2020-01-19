/**
 * Window.js
 * @lastModified 2019085
 * @forwardCompatibleTo 2019085
 * @createAt 2019085
 */

import notImplemented from './not-implemented';

class Document{
  constructor( options = {}, context, frame ){
    let body = options.body;
    if (!options.body) {
      body = document.createElement( 'body' );
      document.documentElement.appendChild( body );
    }

    const eventListeners = [];

    return new Proxy( document, {
      set(target, name, value) {
        switch( name ) {
          case 'cookie':
            document.cookie = value;
            break;
          default:
            target[name] = value;
        }
        return true;
      },

      get( target, name ){
        switch( name ){
          case 'body':
            return body;
          case 'location':
            return context.location
          case 'defaultView':
            return context.window;

          case 'write':
          case 'writeln':
            return () => {}

          case 'createElement':
            return ( ...args ) => {
              const el = document.createElement( ...args );
              el.ownerAppWindow = context.window;
              return el;
            }

          case 'addEventListener':
            return ( ...args ) => {
              eventListeners.push( args );
              return target.addEventListener( ...args );
            }

          case 'removeEventListeners':
            return () => {
              for (const args of eventListeners) {
                target.removeEventListener( ...args );
              }
            }
        }

        if( typeof target[ name ] === 'function' ){
          return target[ name ].bind && target[ name ].bind( target );
        } else {
          return target[ name ];
        }
      }
    } );
  }
}

export default Document;