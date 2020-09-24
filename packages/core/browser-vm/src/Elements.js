/**
 * Elements.js
 * @lastModified 2019085
 * @forwardCompatibleTo 2019085
 * @createAt 2019085
 */

import injectScriptCallBack from './utils/injectScriptCallBack';

const makeElInjector = (originMethod) => function( el, ...args ){
  if( el && el.nodeName === 'SCRIPT' && el.ownerAppWindow ){
    injectScriptCallBack( el );
  }

  // fix: babel 会把 fn.call 转义成 fn.call.apply 造成 chrome 50 的几个版本报错
  // 这里 尝试 try catch 如果报错 直接调用 fn.apply
  try {
    return originMethod.call( this, el, ...args );
  } catch {
    return originMethod.apply( this, [el, ...args] );
  }
}

if( typeof window.Element === 'function' ){
  const mountElementMethods = [ 'appendChild', 'insertBefore', 'append' ];

  for ( const method of mountElementMethods ) {
    const originMethod = window.Element.prototype[ method ];
    window.Element.prototype[ method ] = makeElInjector(originMethod);
  }
}