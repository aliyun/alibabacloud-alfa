import React from 'react';
import beautify from 'js-beautify';

import { storiesOf } from '@storybook/react';

import { createContext } from '../src/index';
const context = createContext( { initURL: 'https://www.example.com/home' } );

const RunCode = ( { title, code, context } ) =>
  <div style={ { cssText: 'margin: 0 0 30px 0' } }>
    <h3 style={ { cssText: 'margin: 5px 10px; font-size: 16px' } }>{ title }</h3>
    <textarea readOnly={ true } value={ beautify.js( code ) } style={ { cssText: `width: 640px; height: ${ ( code.split( '\n' ).length - 2 ) * 20 }px; border: 1px solid rgb(238, 238, 238); border-radius: 3px; background-color: rgb(255, 255, 255); cursor: pointer; font-size: 15px; padding: 3px 10px; margin: 5px 10px; resize: no` } }></textarea>
    <div><button onClick={ () => { Function( 'context', `with(context){${ code }}` )( context ) } } style={ { cssText: 'border: 1px solid rgb(238, 238, 238); border-radius: 3px; background-color: rgb(255, 255, 255); cursor: pointer; font-size: 15px; padding: 3px 10px; margin: 5px 10px' } }>Run</button></div>
  </div>

storiesOf( 'Browser', module )
  .add( 'location', () => {
    return <div>
      <pre style={ { cssText: 'display:block; margin: 30px 10px' } }>
        <code>
          import {'{'} createContext {'}'} from '../index';<br/>
          const context = createContext( {'{'} initURL: 'https://www.example.com/home' {'}'} );<br/>
          const {'{'} window, history, location {'}'} = context;
        </code>
      </pre>

      <RunCode 
        context={ context }
        title="设置并打印 href"
        code={ `
          location.href = '/about';
          console.log( 'location.href:', location.href );
        ` } />

      <RunCode 
        context={ context }
        title="设置 hash 并打印 href"
        code={ `
          location.hash = '#test-hash';
          window.addEventListener( 'hashchange', event => console.log( 'hashchange:', event ) );
          location.hash = '#test-hash-change';
          console.log( 'location.hash:', location.hash );
          console.log( 'location.href:', location.href );
        ` }
      />

      <RunCode 
        context={ context }
        title="设置 search"
        code={ `
          location.search = '?name=value';
          console.log( 'location.href:', location.href );
        ` }
      />

      <RunCode 
        context={ context }
        title="replace 跳转"
        code={ `
          location.replace( '/about' );
          console.log( 'location.href', location.href );
        ` }
      />

      <RunCode 
        context={ context }
        title="assign 跳转"
        code={ `
          location.assign( '/blog' );
          console.log( 'location.href', location.href );
        ` }
      />

      <RunCode 
        context={ context }
        title="修改 origin"
        code={ `
          location.origin = 'www.example2.com';
          console.log( 'location.href', location.href );
        ` }
      />

      <RunCode 
        context={ context }
        title="修改 pathname"
        code={ `
          location.pathname = '/home';
          console.log( 'location.pathname', location.pathname );
          console.log( 'location.href', location.href );
        ` }
      />

      <RunCode 
        context={ context }
        title="修改 port"
        code={ `
          console.log( 'location.port', location.port );
          location.port = '8080';
          console.log( 'location.port', location.port );
          console.log( 'location.href', location.href );
        ` }
      />

      <RunCode 
        context={ context }
        title="ancestorOrigins"
        code={ `
          console.log( 'location.ancestorOrigins', location.ancestorOrigins );
        ` }
      />

      <RunCode 
        context={ context }
        title="reload"
        code={ `
          location.reload();
        ` }
      />

      <RunCode 
        context={ context }
        title="toString() and valueOf()"
        code={ `
          console.log( 'location.toString()', location.toString() );
          console.log( 'location.valueOf()', location.valueOf() );
        ` }
      />
    </div>
  } );