class Location{
  constructor( location ){
    return new Proxy( {}, {
      set(target, name, value) {
        switch( name ) {
          case 'href':
            break;
          default:
            location[name] = value;
        }
        return true;
      },

      get( target, name ){
        switch( name ) {
          case 'reload':
            return () => {};
          case 'replace':
            return () => {};
          case 'toString':
            return () => {
              try {
                return location.toString();
              } catch(e) {
                return location.href;
              }
            };
          default:
            break;
        }
        if( typeof location[ name ] === 'function' ){
          return location[ name ].bind && location[ name ].bind( target );
        } else {
          return location[ name ];
        }
      }
    } );
  }
}

export default Location;