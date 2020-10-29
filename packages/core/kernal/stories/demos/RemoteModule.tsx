import React, { lazy, Suspense } from 'react';
import { loadExposedModule } from '../../src';
import { appInfo } from './constants';

const About = lazy<React.FC<{test: string}>>(
  () => (
    loadExposedModule<React.FC<{ test: string; }>>(appInfo, 'About').then((c) => ({ default: c }))
  )
);

const RemoteModule = () => {
  return (
    <Suspense fallback={<div>loading</div>}>
      <About test="1" />
    </Suspense>
  )
}

export default RemoteModule;