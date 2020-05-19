/**
 * Window.js
 * @lastModified 2019085
 * @forwardCompatibleTo 2019085
 * @createAt 2019085
 */

class Document{
  constructor( options = {}, context, frame ){

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
            return context.body;
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
              el.appId = options.id
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