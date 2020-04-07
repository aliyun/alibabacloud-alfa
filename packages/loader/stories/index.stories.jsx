import * as React from 'react';
import { loadBundle } from '../src';
import { withKnobs, text } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';


const log = (...args) => {
  /* eslint-disable no-console */
  console.log(...args)
}

storiesOf('Loader', module)
  .addDecorator(withKnobs)
  .add('Loader', () => {
    window.__CONSOLE_OS_GLOBAL_VARS_ = {};
    window.__IS_CONSOLE_OS_CONTEXT__ = true;
    const url = text('loadUrl', 'https://g.alicdn.com/ConsoleOS/OSExample/0.0.2/index.js')
    const id = text('id', 'os-example')
    log(url)
    return (
      <>
        <button id="app-wrapper" onClick={
          async () => {
            try {
              const m = await loadBundle({
                id: id,
                url,
                context: {
                  window,
                  location,
                  history,
                  document
                }
              })
              if (m) {
                console.log(m.default)
              }
            } catch (e) {
              console.error(e)
              throw e;
            }
          }}>
          load chuck
        </button>
        <div id="app"/>
      </>
    );
  })
