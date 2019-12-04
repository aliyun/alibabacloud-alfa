import { requireEnsure } from './requireEnsure';
import './hook';
import { IBundleOption } from './type';

/**
 * Load bundle for url
 * @param {IBundleOption} option loader option
 * @returns {Promise<T>} module exports
 */
export async function loadBundle<T>(option: IBundleOption) {
  return await requireEnsure<T>(option);
}
