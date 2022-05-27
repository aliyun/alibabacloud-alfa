export const getJsonCallback = (src) => {
  let u;
  try {
    u = new URL(src);
  } catch (error) {
    return;
  }
  const sp = u.searchParams;
  if (!sp) {
    return null;
  }

  return sp.get('callback') || sp.get('cb');
};

const injectScriptCallBack = (scriptEl) => {
  setTimeout(() => {
    if (!scriptEl.src) {
      return;
    }
    const appWindow = scriptEl.ownerContext.window;
    const callbackName = getJsonCallback(scriptEl.src);
    if (callbackName && typeof appWindow[callbackName] === 'function') {
      window[callbackName] = function (...args) {
        const result = appWindow[callbackName](...args);
        window[callbackName] = null;
        return result;
      };
    }
  }, 0);
};

export default injectScriptCallBack;
