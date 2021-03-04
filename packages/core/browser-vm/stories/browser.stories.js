import * as React from 'react';
import { createContext } from '../src/index';
import { storiesOf } from '@storybook/react';
import { useEffect } from '@storybook/addons';


const context = createContext( { initURL: 'https://www.example.com/home', id: 'test-1', enableScriptEscape: false, externals:['require'] } );

window.require = function() {};
window.require.xxx = 'test';

storiesOf('Loader', module)
  .add('Loader', () => {
    useEffect(() => {
      context.then((ctx) => {
        const fn = eval(`
          (() => function({window, history, locaiton, document}) {
            window.test = 1;
            console.log('test', window.test);
            const script = document.createElement('script')
            script.src = 'https://g.alicdn.com/code/lib/antv-g2/4.0.12/g2.min.js'
            script.addEventListener('load', () => {
              console.log('G2', window.G2)
            })

            script.addEventListener('error', () => {
              console.log('G2 error', window.G2)
            })
 
            document.body.append(script)

            const script1 = document.createElement('script')
            document.body.append(script1)
            script1.innerHTML = "console.log('script1 test',window.test)"
            console.log('window.require', window.require.xxx)
          })()`
        );
        fn({ ...ctx });
      })
    }, []);
    return (<div> 111 </div>);
  })
