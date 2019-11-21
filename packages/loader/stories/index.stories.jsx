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
    const url = text('loadUrl', 'http://127.0.0.1:8080/a.bundle.js')
    log(url)
    return (
      <button id="app-wrapper" onClick={
        async () => {
          try {
            const m = await loadBundle(url)
            if (m) {
              m.bootstrap();
              m.mount();
              m.unmount();
            }
          } catch (e) {
            console.error(e)
            throw e;
          }
        }}>
        load chuck
      </button>
    );
  })
