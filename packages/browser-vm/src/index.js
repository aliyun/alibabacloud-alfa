/**
 * index.js
 * @lastModified 2019085
 * @forwardCompatibleTo 2019085
 * @createAt 2019085
 */

import './Elements';
import Context from './Context';

export const createContext = async ( conf = {} ) => {
  return await Context.create( conf );
}

export const removeContext = async ( context ) => {
  return await Context.remove( context );
}