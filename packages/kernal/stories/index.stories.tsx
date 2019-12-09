import * as React from 'react';
import './index'
import { storiesOf } from '@storybook/react';
import Application from '../../react-application/src';
import { start } from '../src';

start();

storiesOf('Basic Console OS', module)
  .add('Basic Use', () => {
    return (
      <div>
        <Application
          id="os-example"
          manifest="https://g.alicdn.com/ConsoleOS/angular-example/0.0.1/os-exmaple-angular.manifest.json"
        />
      </div>
    )
  })
  .add('Load Angular Application', () => {
    return (
      <div>
        <Application
          id="os-example-angular"
          manifest="https://g.alicdn.com/ConsoleOS/angular-example/0.0.1/os-exmaple-angular.manifest.json"
        />
      </div>
    )
  })