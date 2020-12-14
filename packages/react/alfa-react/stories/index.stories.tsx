import React from 'react';
import { storiesOf } from '@storybook/react';
import Basic from './demos/basic';
import Manifest from './demos/manifest';

storiesOf('Basic Console OS', module)
  .add('Basic Use', () => <Basic />)
  .add('Manifest', () => <Manifest />)