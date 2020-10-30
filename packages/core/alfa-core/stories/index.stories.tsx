import React from 'react';
import { storiesOf } from '@storybook/react';
import Basic from './demos/basic';

storiesOf('Basic Console OS', module)
  .add('Basic Use', () => <Basic />)