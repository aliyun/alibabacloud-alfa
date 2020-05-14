import * as React from 'react';
import { createContext } from '../src/index';
import { storiesOf } from '@storybook/react';
import { useEffect } from '@storybook/addons';


const context = createContext( { initURL: 'https://www.example.com/home' } );

storiesOf('Loader', module)
  .add('Loader', () => {
    useEffect(() => {
      context.then((ctx) => {
        const fn = eval(`(() => function({window, history, locaiton, document}) {
          window.test = 1;
          console.log(window.test)
        })()`)
        fn({
          ...ctx
        });
        document.writeln(window.test)
      })
    }, [])
    return (
      <div>
        
      </div>
    );
  })
