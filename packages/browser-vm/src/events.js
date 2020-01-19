const rawAddEventListener = window.addEventListener;
const rawRemoveEventListener = window.removeEventListener;

export const routingEventsListeningTo = ['resize', 'scroll'];

export const addEventListener = (context) => (type, listener, options) => {
  const listeners = context._listenerMap.get(type) || [];
  context._listenerMap.set(type, [...listeners, listener]);

  if (routingEventsListeningTo.indexOf(type) === -1) {
    return context.baseFrame.addEventListener.call(context.baseFrame.contentWindow, type, listener, options);
  }
  return rawAddEventListener.call(context.baseFrame.contentWindow, type, listener, options);
}

export const removeEventListener = (context) => (type, listener, options) => {
  const storedTypeListeners = context._listenerMap.get(type);
  if (storedTypeListeners && storedTypeListeners.length && storedTypeListeners.indexOf(listener) !== -1) {
    storedTypeListeners.splice(storedTypeListeners.indexOf(listener), 1);
  }

  if (routingEventsListeningTo.indexOf(type) === -1) {
    return context.baseFrame.removeEventListener.call(context.baseFrame.contentWindow, type, listener, options);
  }
  return rawRemoveEventListener.call(context.baseFrame.contentWindow, type, listener, options);
}