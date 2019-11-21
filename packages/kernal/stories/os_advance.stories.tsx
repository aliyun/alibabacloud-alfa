import * as React from 'react';
import { storiesOf } from '@storybook/react';
import Application from '../../react-application/src';

storiesOf('Console OS Advance', module)
  .add('With External', () => {
    return (<div id="app-wrapper">demo</div>);
  })
  .add('Multiple page', () => {
    return (
      <div>
        <div style={{float: 'left', width: "50%"}}>
          <Application
            id="endpoint"
            wrapWith="endpoint"
            externalsVars={[ 'ALIYUN_CONSOLE_CONFIG' ]}
            manifest="https://g.alicdn.com/aliyun-next/endpoint/0.1.2/endpoint.manifest.json"
          />
        </div>
        <div style={{float: 'left', width: "50%"}}>
          <Application
            id="config"
            wrapWith="config"
            externalsVars={[ 'ALIYUN_CONSOLE_CONFIG' ]}
            manifest="https://g.alicdn.com/ConsoleOS/OSExample/0.1.0/config.manifest.json"
          />
        </div>
      </div>
    )
  })