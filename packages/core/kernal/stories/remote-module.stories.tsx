import React, { lazy, Suspense } from 'react';
import { storiesOf } from '@storybook/react';
import { start, loadExposedModule } from '../src';
start();

const appInfo = {
  id: 'os-example',
  manifest: 'http://localhost:8081/os-example.manifest.json'
}

const About = lazy<React.FC<{test: string}>>(
  () => loadExposedModule(appInfo, 'About').then((c) => ({ default: c }))
);

storiesOf('Console OS Advance', module)
  .add('Remote Module', () => {
    return (
      <Suspense fallback={<div>loading</div>}>
        <About test="1" />
      </Suspense>
    )
  });