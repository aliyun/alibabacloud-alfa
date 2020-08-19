import React, { lazy, Suspense } from 'react';
import { storiesOf } from '@storybook/react';
import { start, loadExposedModule } from '../src';
start();

const appInfo = {
  id: 'os-example',
  manifest: 'http://dev.g.alicdn.com/ConsoleOS/OSExample/0.0.5/os-example.manifest.json'
}

const About = lazy<React.FC<{test: string}>>(
  // @ts-ignore
  () => loadExposedModule(appInfo, 'About').then((c) => ({ default: c }))
);

const Dashboard = lazy<React.FC<{test: string}>>(
  // @ts-ignore
  () => loadExposedModule(appInfo, 'Dashboard').then((c) => ({ default: c }))
);

storiesOf('Console OS Advance', module)
  .add('Remote Module', () => {
    return (
      <>
        <Suspense fallback={<div>loading</div>}>
          <About test="1" />
        </Suspense>
        <Suspense fallback={<div>loading</div>}>
          <Dashboard test="1" />
        </Suspense>
      </>
    )
  });