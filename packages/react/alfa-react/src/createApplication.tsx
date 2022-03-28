import React, { useRef, useEffect, useState, useMemo } from 'react';
import { BaseLoader } from '@alicloud/alfa-core';

import Loading from './components/Loading';
import { normalizeName } from './utils';
import { AlfaFactoryOption, MicroApplication } from './types';
import { version as loaderVersion } from './version';

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
    const appRef = useRef<HTMLElement | undefined>(undefined);
    const tagName = normalizeName(props.name);

    const sandbox = useMemo(() => {
      return {
        ...customSandbox,
        // allowResources: [
        //   ...(customSandbox?.allowResources || []),
        //   /^https?:\/\/at\.alicdn\.com\//,
        // ],
        externalsVars: [
          ...(customSandbox?.externalsVars || []),
          // global vars used in ConsoleBase.forApp
          '_console_base_ready_',
        ],
      };
    }, [customSandbox]);

    useEffect(() => {
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
          return logger?.error && logger.error({ E_CODE: 'RuntimeError', E_MSG: 'load app failed.' });
        }

        if (!appRef.current) {
          return logger?.error && logger.error({ E_CODE: 'RuntimeError', E_MSG: 'cannot find container.' });
        }

        await App.mount(appRef.current, {
          customProps,
        });

        setApp(App);
      })().catch((e) => {
        throw e;
      });

      return () => {
        app && app.unmount();
      };
    }, [
      app, name, manifest, customProps, sandbox, entry, url, version, container,
      customLogger, deps, env, beforeMount, afterMount, beforeUnmount, afterUnmount, beforeUpdate,
    ]);

    if (app) {
      app.update(customProps);
    }

    const dataAttrs = {
      'data-id': version,
      'data-version': version,
      'data-loader': loaderVersion,
    };

    return (
      <>
        {
          !app ? <Loading loading={loading} /> : null
        }
        {
          (sandbox && sandbox.disableFakeBody)
            ? React.createElement(tagName, { style, className, ref: appRef, ...dataAttrs })
            : React.createElement(tagName, { ...dataAttrs }, React.createElement('div', { ref: appRef, style, className }))
        }
      </>
    );
  };
}
