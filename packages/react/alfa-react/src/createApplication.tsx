import React, { useRef, useEffect, useState, useMemo } from 'react';
import { BaseLoader } from '@alicloud/alfa-core';

import Loading from './components/Loading';
import { normalizeName } from './utils';
import { AlfaFactoryOption, MicroApplication } from './types';
import { version as loaderVersion } from './version';

interface IProps<C = any> extends AlfaFactoryOption {
  customProps: C;
}

interface IWin {
  UA_Opt?: {
    LogVal?: string;
  };
  RISK_INFO?: {
    UMID?: string;
  };
  um?: {
    getToken?: () => any;
  };
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
      afterUnmount, beforeUpdate, sandbox: customSandbox, locale, dynamicConfig = true,
    } = props;
    const [appInstance, setAppInstance] = useState<MicroApplication | null>(null);
    const [, setError] = useState(null);
    const appRef = useRef<HTMLElement | undefined>(undefined);
    const tagName = normalizeName(props.name);

    const sandbox = useMemo(() => {
      const aliyunExternalsVars = [];

      if ((window as IWin).UA_Opt?.LogVal) {
        aliyunExternalsVars.push('UA_Opt');
        aliyunExternalsVars.push((window as IWin).UA_Opt?.LogVal as string);
      }

      if ((window as IWin).RISK_INFO?.UMID) aliyunExternalsVars.push('RISK_INFO');

      if ((window as IWin).um?.getToken) aliyunExternalsVars.push('um');

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
          // risk control
          ...aliyunExternalsVars,
        ],
      };
    }, [customSandbox]);

    // 固化第一次的配置
    const memoOptions = useMemo(() => ({
      entry, // deprecated
      url, // deprecated
      name,
      version,
      manifest,
      container,
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
      locale,
      dynamicConfig,
    }), []);

    useEffect(() => {
      let isUnmounted = false;
      let App: MicroApplication | undefined;
      (async () => {
        const { app, logger } = await loader.register<C>({
          ...memoOptions,
          container: memoOptions.container || appRef.current,
        });

        App = app;

        // container has been unmounted
        if (isUnmounted) return;

        if (!app) {
          return logger?.error && logger.error({ E_CODE: 'RuntimeError', E_MSG: 'load app failed.' });
        }

        if (!appRef.current) {
          return logger?.error && logger.error({ E_CODE: 'RuntimeError', E_MSG: 'cannot find container.' });
        }

        // update body in sandbox context
        app.context.updateBody?.(memoOptions.sandbox.disableFakeBody ? document.body : appRef.current);

        await app.mount(appRef.current, {
          customProps,
        });

        setAppInstance(app);
      })().catch((e) => {
        setError(() => {
          throw e;
        });
      });

      return () => {
        isUnmounted = true;
        App && App.unmount();
      };
    }, [memoOptions]);

    if (appInstance) {
      appInstance.update(customProps);
    }

    const dataAttrs = {
      'data-id': name,
      'data-version': version,
      'data-loader': loaderVersion,
    };

    return (
      <>
        {
          !appInstance ? <Loading loading={loading} /> : null
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
