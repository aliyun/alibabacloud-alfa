export function isConstructable(fn) {
  const classRegex = /^class\b/;

  const constructable =
    (fn.prototype && fn.prototype.constructor === fn && Object.getOwnPropertyNames(fn.prototype).length > 1) ||
    classRegex.test(fn.toString());
  return constructable;
}

export function isBoundedFunction(fn) {
  const bounded = fn.name.indexOf('bound ') === 0 && !fn.hasOwnProperty('prototype');
  return bounded;
}

