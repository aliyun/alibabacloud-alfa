/**
 * Window.js
 * @lastModified 2019085
 * @forwardCompatibleTo 2019085
 * @createAt 2019085
 */
class Document{
  constructor( location ){
    return new Proxy( location, {
      set(target, name, value) {
        switch( name ) {
          case 'href':
            break;
          default:
            target[name] = value;
        }
        return true;
      },

      get( target, name ){
        switch( name ) {
          case 'reload':
            return () => {};
          case 'replace':
            return () => {};
          default:
            break;
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