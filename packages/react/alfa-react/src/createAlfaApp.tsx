import React from 'react';
import { BaseLoader } from '@alicloud/alfa-core';

import ErrorBoundary from './components/ErrorBoundary';
import { AlfaFactoryOption } from './types';
import createApplication from './createApplication';
import beforeResolveHook from './hooks/beforeResolveHook';
import afterLoadHook from './hooks/afterLoadHook';

const loader = BaseLoader.create();

loader.beforeResolve.use(beforeResolveHook);
loader.afterLoad.use(afterLoadHook);

const Application = createApplication(loader);

function createAlfaApp<P = any>(option: AlfaFactoryOption) {
  const { name, dependencies } = option || {};

  // check app option
  if (!name) return () => null;

  const passedInOption = option;

  return React.memo((props: P) => (
    <ErrorBoundary {...props}>
      <Application<P>
        {...passedInOption}
        deps={dependencies || {}}
        customProps={props}
      />
    </ErrorBoundary>
  ));
}

export default createAlfaApp;
