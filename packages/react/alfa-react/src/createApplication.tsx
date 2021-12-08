import React, { Suspense, useRef, useEffect, useState } from 'react';
import { BaseLoader } from '@alicloud/alfa-core';

import Loading from './components/Loading';
import { normalizeName } from './utils';
import { AlfaFactoryOption, MicroApplication } from './types';

interface IProps<C = any> extends AlfaFactoryOption {
  customProps: C;
}

/**
 * container for microApp mount
 * @param loader alfa-core loader
 * @returns
 */
export default function createApplication(loader: BaseLoader) {
  function Application<C = any>(props: IProps<C>) {
    const {
      name, manifest, loading, sandbox, customProps, className, style,
    } = props;
    const [app, setApp] = useState<MicroApplication | null>(null);
    const appRef = useRef<HTMLElement | null | undefined>(null);
    const tagName = normalizeName(props.name);

    useEffect(() => {
      // eslint-disable-next-line no-useless-catch
      (async () => {
        const { app: App } = await loader.register<C>({
          name,
          manifest,
          container: appRef.current,
          props: customProps,
          sandbox,
        });

        if (!App) throw new Error('[alfa-react] load app failed.');

        await App.load();

        if (!appRef.current) throw new Error('[alfa-react] container not found');

        await App.mount(appRef.current, {
          customProps,
        });

        setApp(App);

        return () => {
          App && App.unmount();
        };
      })().catch((e) => {
        throw e;
      });
    }, [name, manifest, customProps, sandbox]);

    if (app) {
      app.update(customProps);
    }

    return (
      <Suspense fallback={<Loading loading={loading} />}>
        <>
          {
            (sandbox && sandbox !== true && sandbox.disableFakeBody)
              ? React.createElement(tagName, { style, className, ref: appRef, dataId: name })
              : React.createElement(tagName, {}, React.createElement('div', { ref: appRef }))
          }
        </>
      </Suspense>
    );
  }

  return Application;
}
