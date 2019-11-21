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
          id="config"
          wrapWith="config"
          externalsVars={[ 'ALIYUN_CONSOLE_CONFIG' ]}
          url="https://g.alicdn.com/ConsoleOS/OSExample/0.1.0/config.js"
        />
      </div>
    )
  })
  .add('With Manifest', () => {
    return (
      <div>
        <Application
          id="endpoint"
          wrapWith="endpoint"
          externalsVars={[ 'ALIYUN_CONSOLE_CONFIG' ]}
          manifest="https://g.alicdn.com/aliyun-next/endpoint/0.1.2/endpoint.manifest.json"
        />
      </div>
    )
  })