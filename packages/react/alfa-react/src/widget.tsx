import React, { lazy, Suspense } from 'react';
import { loadBundle } from '@alicloud/console-os-loader'

import { WidgetFactoryOption, WidgetCWSConfig } from './types';
import { getWidgetVersionById, getWidgetDeps, getWidgetConfigById, eventEmitter } from './widget/index';
import ErrorBoundary from './components/ErrorBoundary';
import Loading from './components/Loading';

export function createAlfaWidget<T>(option: WidgetFactoryOption) {
  const AlfaWidget = lazy(async () => {
    let url = option.url;

    let config: WidgetCWSConfig = {
      links: {},
      features: {},
      locales: {},
      conf: {}
    }

    if (!url) {
      const { version, entryUrl } = await getWidgetVersionById(option);
      url = entryUrl;
      config = await getWidgetConfigById({ ...option, version });
    }

    const deps = await getWidgetDeps(config, option);

    return loadBundle({
      id: option.name,
      url: option.url || url,
      deps: {
        ...deps,
        ...option.dependencies
      },
      xmlrequest: true,
      context:{
        window,
        location,
        history,
        document
      }
    });

  });

  return (props: T) => (
    <Suspense fallback={<Loading loading={option.loading}/>}>
      <ErrorBoundary {...props}>
        <AlfaWidget eventEmitter={eventEmitter} {...props} />
      </ErrorBoundary>
    </Suspense>
  )
}