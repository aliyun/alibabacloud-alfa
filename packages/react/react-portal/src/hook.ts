import { useContext, useEffect, useMemo, useRef } from 'react';

import { Context } from './Context';

/**
 * 获取微应用上下文
 */
export function useAlfaMicroAppContext() {
  return useContext(Context);
}

/**
 * 监听微应用事件
 * @param eventName 事件名称
 * @param cb 事件回调
 */
export function useMicroAppEvent(eventName: string, cb: (args: any) => void) {
  const { appProps } = useAlfaMicroAppContext();

  const fn = useRef(cb);

  fn.current = cb;

  useEffect(() => {
    const listener = (args: any) => {
      if (fn.current) fn.current(args);
    };

    appProps.emitter.on(eventName, listener);

    return () => {
      appProps.emitter.off(eventName, listener);
    };
  }, [appProps.emitter, eventName]);
}

/**
 * 外部链接导航 hook
 * @returns {Function}
 */
export function useExternalLink() {
  const { appProps } = useAlfaMicroAppContext();

  const navigate = useMemo(() => {
    return (url: any) => {
      if (appProps.emitter && appProps.name) {
        appProps.emitter.emit(`${appProps.name}:external-router`, url);
      }
    };
  }, [appProps.emitter, appProps.name]);

  return navigate;
}
