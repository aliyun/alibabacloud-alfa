import * as React from 'react';
import './index.js'
import Application from '../src';
import Skeleton from '../src/Skeleton';
import { storiesOf } from '@storybook/react';

storiesOf('Console Application', module)
  .add('With Manifest', () => {
    return (
      // @ts-ignore
      <Application
        id="endpoint"
        wrapWith="endpoint"
        externalsVars={['ALIYUN_CONSOLE_CONFIG']}
        manifest="https://g.alicdn.com/aliyun-next/endpoint/0.1.2/endpoint.manifest.json"
      />
    )
  })
  .add('With Error', () => {
    return (
      // @ts-ignore
      <Application
        id="endpoint"
        wrapWith="endpoint"
        manifest="https://g.alicdn.com/aliyun-next/endpoint/0.1.2/endpoint.manifest.json"
      />
    )
  })
  .add('Skeleton', () => {
    return (
      <Skeleton active />
    )
  })