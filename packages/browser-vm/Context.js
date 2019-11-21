/**
 * Context
 * @lastModified 2019086
 * @forwardCompatibleTo 2019086
 * @createAt 2019086
 */

import Window from './Window';
import Document from './Document';

class Context {
  constructor( conf, frame ){
    this.window = new Window( conf, this, frame );
    this.document = new Document( conf, this, frame );
    this.location = this.window.location;
    this.history = this.window.history;
    this.baseFrame = frame;
    this.window.__IS_CONSOLE_OS_CONTEXT__ = true
  }

  remove(){
    this.document.removeEventListeners();

    if( this.baseFrame ){
      if( this.baseFrame.parentNode ){
        this.baseFrame.parentNode.removeChild( this.baseFrame );
      }else{
        this.baseFrame.setAttribute( 'src', 'about:blank' );
      }
    }
  }

  static create( conf ){
    return new Promise((resolve) => {
      const iframe = document.createElement( 'iframe' );

      // TODO: change src to a reasonable value.
      iframe.setAttribute( 'src', '/api.json' );
      iframe.style.cssText = 'position: absolute; top: -20000px; width: 1px; height: 1px;';

      document.body.append( iframe );

      iframe.onload = () => {
        resolve(new this( conf, iframe ));
      }
    })
  }

  static async remove( context ){
    if( context.remove ){
      context.remove();
    }
  }
}

export default Context;