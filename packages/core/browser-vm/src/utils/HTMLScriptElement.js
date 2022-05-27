export const addEventListener = (el, originEvent) => (type, listener, options) => {
  const listeners = el._listenerMap.get(type) || [];
  el._listenerMap.set(type, [...listeners, listener]);
  return originEvent.apply(el, [type, listener, options]);
};

export const removeEventListener = (el, originEvent) => (type, listener, options) => {
  const storedTypeListeners = el._listenerMap.get(type);
  if (storedTypeListeners && storedTypeListeners.length && storedTypeListeners.indexOf(listener) !== -1) {
    storedTypeListeners.splice(storedTypeListeners.indexOf(listener), 1);
  }
  return originEvent.apply(el, [type, listener, options]);
};

const elProperties = ['innerHTML', 'text', 'innerText'];

export const injectHTMLScriptElement = (el) => {
  el._listenerMap = new Map();
  el.addEventListener = addEventListener(el, el.addEventListener);
  el.removeEventListener = removeEventListener(el, el.removeEventListener);

  elProperties.forEach((property) => {
    Object.defineProperty(el, property, {
      get: function get() {
        return this.scriptText || '';
      },
      set: function set(value) {
        this.scriptText = value;
        // 如果是已经插入到 dom 树里面，则直接执行
        if (el.parentNode) {
          this.ownerContext.evalScript && el.ownerContext.evalScript(value.toString());
        }
      },
      enumerable: false,
    });
  });
};
