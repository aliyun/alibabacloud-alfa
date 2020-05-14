import * as React from 'react';
import { storiesOf } from '@storybook/react';
import Application from '../../react-application/src';

storiesOf('Console OS Advance', module)
  .add('Multiple page', () => {
    return (
      <div>
        <div style={{float: 'left', width: "50%"}}>
          <Application
            id="os-example"
            manifest="https://g.alicdn.com/ConsoleOS/OSExample/0.0.2/os-example.manifest.json"
          />
        </div>
        <div style={{float: 'left', width: "50%"}}>
          <Application
            id="os-example-angular"
            manifest="https://g.alicdn.com/ConsoleOS/angular-example/0.0.1/os-exmaple-angular.manifest.json"
          />
        </div>
      </div>
    )
  })