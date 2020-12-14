import React, { lazy, Suspense } from 'react';
import { loadBundle } from '@alicloud/console-os-loader'

import { AlfaFactoryOption, WidgetCWSConfig } from './types';
import { getWidgetVersionById, getWidgetDeps, getWidgetConfigById } from './widget/index';
import ErrorBoundary from './components/ErrorBoundary';
import Loading from './components/Loading';

export function createAlfaWidget<T>(option: AlfaFactoryOption) {
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

    const deps = await getWidgetDeps(config);

    return loadBundle({
      id: option.name,
      url: option.url || url,
      deps,
      xmlrequest: true,
    });

  });

  return (props: T) => (
    <Suspense fallback={<Loading loading={option.loading}/>}>
      <ErrorBoundary {...props}>
        <AlfaWidget {...props} />
      </ErrorBoundary>
    </Suspense>
  )
}
