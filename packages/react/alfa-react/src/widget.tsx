import React, { lazy, Suspense } from 'react';
import { loadBundle } from '@alicloud/console-os-loader';

import { WidgetFactoryOption, WidgetCWSConfig } from './types';
import { getWidgetVersionById, getWidgetDeps, getWidgetConfigById, eventEmitter } from './widget/index';
import ErrorBoundary from './components/ErrorBoundary';
import Loading from './components/Loading';
import { normalizeName } from './utils';

export function createCWSWidget<T>(option: WidgetFactoryOption) {
  const AlfaWidget = lazy(async () => {
    let { url } = option;

    let config: WidgetCWSConfig = {
      links: {},
      features: {},
      locales: {},
      conf: {},
    };

    if (!url) {
      const { version, entryUrl } = await getWidgetVersionById(option);
      url = entryUrl;
      config = await getWidgetConfigById({ ...option, version });
    }

    const deps = await getWidgetDeps(config, option);

    return loadBundle({
      id: normalizeName(option.name),
      url: (option.url || url || '').replace('index.js', (option?.alfaLoader) ? 'index.alfa.js' : 'index.js'),
      deps: {
        ...deps,
        ...option.dependencies,
      },
      xmlrequest: !option.alfaLoader,
      context: {
        window,
        location,
        history,
        document,
      },
    });
  });

  return (props: T) => (
    <Suspense fallback={<Loading loading={option.loading} />}>
      <ErrorBoundary {...props}>
        <AlfaWidget eventEmitter={eventEmitter} {...props} />
      </ErrorBoundary>
    </Suspense>
  );
}
