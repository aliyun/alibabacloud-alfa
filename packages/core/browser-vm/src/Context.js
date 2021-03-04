/**
 * Context
 * @lastModified 2019086
 * @forwardCompatibleTo 2019086
 * @createAt 2019086
 */

import Window from './Window';
import Document from './Document';
import Location from './Location';
import History from './History';
import { getFetchCredentials } from './utils/credentials';

class Context {
  constructor( conf, frame ){
    this.location = new Location(frame.contentWindow.location);
    this.history = new History(conf.id, frame.contentWindow);
    this.window = new Window( conf, this, frame, location);
    this.allowResources = conf.allowResources || [];
    let body = conf.body;

    if (conf.disableBody) {
      body = document.body;
    } else if (!conf.body) {
      body = document.createElement( 'body' );
      document.documentElement.appendChild( body );
    }

    this.body = body;
    this.document = new Document( {
      enableScriptEscape: true,
      ...conf
    }, this, frame, location );
    this.baseFrame = frame;
    this._listenerMap = new Map();
    this.window.__IS_CONSOLE_OS_CONTEXT__ = true
  }
  
  async loadScripts(url) {
    const resp = await fetch(url, {credentials: getFetchCredentials(url)});
    const code = await resp.text();
    this.evalScript(code, url);
  }

  evalScript(code, url="") {
    const resolver = new Function(`
      return function ({window, location, history, document}){ 
        with(window.__CONSOLE_OS_GLOBAL_VARS_) {
          try {
            ${code}
          }
          catch(e) {
            console.log(e)
          }
        }
      }//@ sourceMappingURL=${url}`)
    resolver().call(this.window, {...this})
  }

  updateBody(dom) {
    this.body = dom;
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
      iframe.setAttribute( 'src', conf.url ? conf.url : '/api.json');
      iframe.style.cssText = 'position: absolute; top: -20000px; width: 100%; height: 1px;';

      document.body.appendChild( iframe );

      // the onload will no trigger when src is about:blank
      if (conf.url === 'about:blank') {
        return resolve(new this( conf, iframe ));
      }

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