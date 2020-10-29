import * as React from 'react';
import { storiesOf } from '@storybook/react';
import ErrorBoundary from '../src/ErrorBoundary'

const A = ({a}) => { 
  console.log(a.test())
  return <div />
};

storiesOf('CopyId', module)
  .add('ErrorBoundary', () => {
  return (<ErrorBoundary>
      <A a={{}}/>
    </ErrorBoundary>);
  });
