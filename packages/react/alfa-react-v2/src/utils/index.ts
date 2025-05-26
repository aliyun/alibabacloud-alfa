interface IWin {
  __IS_CONSOLE_OS_CONTEXT__?: boolean;
}

/**
 * kernel 会为沙箱 context 注入 __IS_CONSOLE_OS_CONTEXT__
 */
declare let context: {
  __IS_CONSOLE_OS_CONTEXT__: boolean;
};

export const normalizeName = (name: string) => {
  return name.replace(/@/g, '').replace(/\//g, '-');
};

/**
 * 判断是否在沙箱环境中运行
 */
export const isOsContext = (): boolean => {
  try {
    return context.__IS_CONSOLE_OS_CONTEXT__;
  } catch (e) {
    // 历史逻辑问题，window.__IS_CONSOLE_OS_CONTEXT__ 会被污染导致判断异常
    // 降级
    return !!(window as IWin).__IS_CONSOLE_OS_CONTEXT__;
  }
};

/**
 * set native object property
 * @param obj
 * @param propertyName
 * @param value
 * @returns
 */
export const setNativeProperty = (obj: any, propertyName: string, value: any) => {
  const desc = Object.getOwnPropertyDescriptor(obj, propertyName);

  // in strict mode, Cannot set property go of [xx] which has only a getter
  if (desc && typeof desc.set === 'undefined') return;

  obj[propertyName] = value;
};

export const IS_SSR = typeof document === 'undefined';

/**
 * 去掉 location.origin 的路径
 */
export const peelPath = (location: Location) => {
  return location.pathname + location.search + location.hash;
};

export const resolvePath = (...args: Array<string | undefined>) => {
  return `/${ args.join('/')}`.replace(/\/+/g, '/');
};

export const addBasename = (path: string, basename?: string) => {
  if (!basename) return path;

  return resolvePath(basename, path);
};
export const addLeftSlash = (path: string) => {
  return path.charAt(0) === '/' ? path : `/${ path}`;
};

/**
 * 从 path 移除 basename 部分
 * @param path
 * @param basename
 * @returns string
 */
export const stripBasename = (path: string, basename?: string) => {
  if (!basename) return path;

  const _path = resolvePath(path);
  const _basename = resolvePath(basename);

  if (_path === _basename) return '/';
  // escape all possible regex special characters
  return _path.replace(new RegExp(`^${_basename.replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1')}`, 'ig'), '');
};

/**
 * fix Error (we do not know why):
 * Failed to read the 'state' property from 'History':
 * May not use a History object associated with a Document that is not fully active
 * @returns any
 */
export const getHistoryState = () => {
  try {
    return window?.history.state;
  } catch (e) {
    return null;
  }
};
