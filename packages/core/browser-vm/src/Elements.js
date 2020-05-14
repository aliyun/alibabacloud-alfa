/**
 * Elements.js
 * @lastModified 2019085
 * @forwardCompatibleTo 2019085
 * @createAt 2019085
 */

import injectScriptCallBack from './utils/injectScriptCallBack';
import injectElementToBody from './utils/injectElementToBody';

if( typeof window.Element === 'function' ){
  const mountElementMethods = [ 'appendChild', 'insertBefore', 'append' ];

  for ( const method of mountElementMethods ) {
    let originMethod = Element.prototype[ method ];

    window.Element.prototype[ method ] = function( el, ...args ){
      if( el && el.nodeName === 'SCRIPT' && el.ownerAppWindow ){
        injectScriptCallBack( el );
      }

      if (this.nodeName === 'BODY' && el.ownerAppWindow) {
        return injectElementToBody( el, method );
      }

      return originMethod.call( this, el, ...args );
    }
  }
}