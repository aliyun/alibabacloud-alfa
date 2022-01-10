import React, { useRef, useEffect, useState, useMemo } from 'react';
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
  return function Application<C = any>(props: IProps<C>) {
    const {
      name, version, manifest, loading, customProps, className, style, container,
      entry, url, logger: customLogger, deps, env, beforeMount, afterMount, beforeUnmount,
      afterUnmount, beforeUpdate, sandbox: customSandbox,
    } = props;
    const [app, setApp] = useState<MicroApplication | null>(null);
    const appRef = useRef<HTMLElement | null | undefined>(null);
    const tagName = normalizeName(props.name);

    const sandbox = useMemo(() => {
      return {
        ...customSandbox,
        externalsVars: [
          ...(customSandbox?.externalsVars || []),
          // global vars used in ConsoleBase.forApp
          '_console_base_ready_',
        ],
      };
    }, [customSandbox]);

    useEffect(() => {
      // eslint-disable-next-line no-useless-catch
      (async () => {
        const { app: App, logger } = await loader.register<C>({
          entry,
          url,
          name,
          version,
          manifest,
          container: container || appRef.current,
          props: customProps,
          sandbox,
          logger: customLogger,
          deps,
          env,
          beforeMount,
          afterMount,
          beforeUnmount,
          afterUnmount,
          beforeUpdate,
        });

        if (!App) {
          return logger?.error({ E_MSG: 'load app failed.' });
        }

        if (!appRef.current) {
          return logger?.error({ E_MSG: 'cannot find container.' });
        }

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
    }, [
      name, manifest, customProps, sandbox, entry, url, version, container,
      customLogger, deps, env, beforeMount, afterMount, beforeUnmount, afterUnmount, beforeUpdate,
    ]);

    if (app) {
      app.update(customProps);
    }

    return (
      <>
        {
          !app ? <Loading loading={loading} /> : null
        }
        {
          (sandbox && sandbox.disableFakeBody)
            ? React.createElement(tagName, { style, className, ref: appRef, dataId: name })
            : React.createElement(tagName, {}, React.createElement('div', { ref: appRef }))
        }
      </>
    );
  };
}
