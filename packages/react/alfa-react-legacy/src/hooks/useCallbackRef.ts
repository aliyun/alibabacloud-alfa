import { useCallback, useRef, useEffect } from 'react';

export function useCallbackRef<T extends (...args: any[]) => any>(callback: T) {
  const ref = useRef(callback);

  useEffect(() => {
    ref.current = callback;
  }, [callback]);

  return useCallback((...args: Parameters<T>) => {
    return ref.current(...args);
  }, []);
}
