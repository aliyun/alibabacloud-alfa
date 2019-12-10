import React, { useEffect } from 'react';
import beautify from 'js-beautify';
import axios from 'axios'

import { storiesOf } from '@storybook/react';

import { createContext } from '../index';
import { useState } from '@storybook/addons';

const RunCode = ( { title, code, context }) =>
  (<div style={{margin: '0 0 30px 0' }}>
    <h3 style={{margin:'5px 10px', fontSize: 16}}>{ title }</h3>
    <div>
      <button
        onClick={ () => { new Function('context',`
          with(context){
            with(window.__CONSOLE_OS_GLOBAL_VARS_){
              ${ code }
            }
          }` )( context ) } }
        style={{
          border: '1px solid rgb(238, 238, 238)',
          borderRadius: 3,
          backgroundColor: 'rgb(255, 255, 255)',
          cursor: 'pointer',
          fontSize: 15,
          padding: '3px 10px',
          margin: '5px 10px'
        }}>
          Run
      </button>
    </div>
  </div>);

let requested  = false;

storiesOf( 'strict Mode', module )
  .add( 'box', () => {
    const [code, setCode] = useState(null)
    const [context, setContext] = useState(null)
    useEffect(() => {
      async function request() {
        const context = await createContext( { initURL: 'https://www.example.com/home' } );
        setContext(context);
        const resp = await axios.get('https://g.alicdn.com/aliyun-next/endpoint/0.1.2/index.js')
        setCode(resp.data);
      }

      if (!requested) {
        request();
        requested = true;
      }
    }, [1]);
    return <div>
      <pre css={ 'display:block; margin: 30px 10px'}>
        <code>
          import {'{'} createContext {'}'} from &apos;../index&apos;;<br/>
          const context = createContext( {'{'} initURL: &apos;https://www.example.com/home&apos; {'}'} );<br/>
          const {'{'} window, history, location {'}'} = context;
        </code>
      </pre>

      {code ? <RunCode
        title="Strict Mode"
        context={context}
        code= {code}
      /> : null}
    </div>
  } );