import { useEffect, useRef } from 'react';
import { createEventBus } from '@alicloud/alfa-core';

const emitter = createEventBus();

export function useLoaderEvent<P = any>(eventName: string, cb: (args: P) => void) {
  const fn = useRef(cb);

  fn.current = cb;

  useEffect(() => {
    const listener = (args: any) => {
      if (fn.current) fn.current(args);
    };

    emitter.on(eventName, listener);

    return () => {
      emitter.off(eventName, listener);
    };
  }, [eventName]);
}
