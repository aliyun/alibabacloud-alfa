import * as React from 'react';
import { storiesOf } from '@storybook/react';
// @ts-ignore
import Application from '../../../react/react-application/src';

storiesOf('Console OS Advance', module)
  .add('Multiple page', () => {
    return (
      <div>
        <div style={{float: 'left', width: "50%"}}>
          <Application
            id="os-example"
            singleton={false}
            manifest="https://g.alicdn.com/ConsoleOS/OSExample/0.0.2/os-example.manifest.json"
          />
        </div>
        <div style={{float: 'left', width: "50%"}}>
          <Application
            id="os-example"
            singleton={false}
            sandbox={{
              initialPath: '/about'
            }}
            manifest="https://g.alicdn.com/ConsoleOS/OSExample/0.0.2/os-example.manifest.json"
          />
        </div>
      </div>
    )
  })