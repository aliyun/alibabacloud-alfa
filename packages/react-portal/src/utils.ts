
declare global {
  interface Window {
    __IS_CONSOLE_OS_CONTEXT__: boolean;
  }
}
export const isOsContext = (): boolean => {
  return window.__IS_CONSOLE_OS_CONTEXT__;
}