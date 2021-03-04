export function isConstructable(fn) {
  // const constructableFunctionRegex = /^function\b\s[A-Z].*/;
  const classRegex = /^class\b/;

  const constructable =
    (fn.prototype && fn.prototype.constructor === fn && Object.getOwnPropertyNames(fn.prototype).length > 1) ||
    // constructableFunctionRegex.test(fn.toString()) ||
    classRegex.test(fn.toString());
  return constructable;
}

export function isBoundedFunction(fn) {
  const bounded = fn.name.indexOf('bound ') === 0 && !fn.hasOwnProperty('prototype');
  return bounded;
}

