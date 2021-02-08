export const addEventListener = (el, originEvent) => (type, listener, options) => {
  const listeners = el._listenerMap.get(type) || [];
  el._listenerMap.set(type, [...listeners, listener]);
  return originEvent.apply(el, [type, listener, options]);
}

export const removeEventListener = (el, originEvent) => (type, listener, options) => {
  const storedTypeListeners = el._listenerMap.get(type);
  if (storedTypeListeners && storedTypeListeners.length && storedTypeListeners.indexOf(listener) !== -1) {
    storedTypeListeners.splice(storedTypeListeners.indexOf(listener), 1);
  }
  return originEvent.apply(el, [type, listener, options]);
}