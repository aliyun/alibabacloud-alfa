/**
 * Elements.js
 * @lastModified 2019085
 * @forwardCompatibleTo 2019085
 * @createAt 2019085
 */

import injectScriptCallBack from './utils/injectScriptCallBack';

if( typeof window.Element === 'function' ){
  const mountElementMethods = [ 'appendChild', 'insertBefore', 'append' ];

  for ( const method of mountElementMethods ) {
    let originMethod = Element.prototype[ method ];

    window.Element.prototype[ method ] = function( el, ...args ){
      if( el && el.nodeName === 'SCRIPT' && el.ownerAppWindow ){
        injectScriptCallBack( el );
      }

      try {
        return originMethod.call( this, el, ...args );
      } catch {
        return originMethod.apply( this, [el, ...args] );
      }
    }
  }
}