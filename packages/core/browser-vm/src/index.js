/**
 * index.js
 * @lastModified 2019085
 * @forwardCompatibleTo 2019085
 * @createAt 2019085
 */

import './Elements';
import Context from './Context';

export const createContext = async (conf = {}) => {
  return await Context.create(conf);
};

export const removeContext = async (context) => {
  return await Context.remove(context);
};

export const evalScripts = async (code, conf = {}) => {
  const ctx = await Context.create(conf);
  // eslint-disable-next-line no-new-func
  const resolver = new Function(`
    return function({window, location, history, document}){ 
      with(window.__CONSOLE_OS_GLOBAL_VARS_) { 
        ${code}
      }
    }//@sourceURL=${conf.name}`);
  return resolver({ ...ctx });
};
