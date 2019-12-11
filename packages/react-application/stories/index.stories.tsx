import * as React from 'react';
import Application from '../src';
import Skeleton from '../src/Skeleton';
import { storiesOf } from '@storybook/react';
import { start } from '@alicloud/console-os-kernal';

storiesOf('Console Application', module)
  .add('With Manifest', () => {
    return (
      <Application
        id="os-example"
        manifest="https://g.alicdn.com/ConsoleOS/OSExample/0.0.2/os-example.manifest.json"
      />
    )
  })
  .add('With Error', () => {
    return (
      <Application
        id="os-example"
        manifest="https://g.alicdn.com/ConsoleOS/OSExample/0.0.2/os-example.manifest.json"
      />
    )
  })
  .add('Skeleton', () => {
    return (
      <Skeleton active />
    )
  })

start()