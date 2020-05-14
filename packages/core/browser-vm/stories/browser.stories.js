import * as React from 'react';
import { createContext } from '../src/index';
import { storiesOf } from '@storybook/react';
import { useEffect } from '@storybook/addons';


const context = createContext( { initURL: 'https://www.example.com/home', id: 'test-1' } );

storiesOf('Loader', module)
  .add('Loader', () => {
    useEffect(() => {
      context.then((ctx) => {
        const fn = eval(`
          (() => function({window, history, locaiton, document}) {
            window.test = 1;
            console.log(window.test);
            const div = document.createElement('div')
            document.body.appendChild(div)
          })()`
        );
        fn({ ...ctx });
      })
    }, []);
    return (<div> 111 </div>);
  })
