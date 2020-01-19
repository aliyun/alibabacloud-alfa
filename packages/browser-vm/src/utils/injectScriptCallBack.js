/**
 * injectScriptCallBack
 * @lastModified 20190821
 * @forwardCompatibleTo 20190821
 * @createAt 20190821
 */

const injectScriptCallBack = scriptEl => {
  setTimeout( () => {
    let u;

    if( !scriptEl.src ){
      return ;
    }
    
    try{
      u = new URL( scriptEl.src );
    }catch( error ){
      return ;
    }
  
    const sp = u.searchParams;
    const appWindow = scriptEl.ownerAppWindow;
  
    if( sp ){
      const callbackName = sp.get( 'callback' ) || sp.get( 'cb' );
  
      if( callbackName && typeof appWindow[ callbackName ] === 'function' ){
        window[ callbackName ] = function( ...args ){
          const result = appWindow[ callbackName ]( ...args );
          window[ callbackName ] = null;
          return result;
        }
      }
    }

  }, 0 );
}

export default injectScriptCallBack;