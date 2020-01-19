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

export async function loadScriptsWithContext<T>(option: IBundleOption) {
  return await requireEnsure<T>({
    ...option,
    id: `${option.id}_scripts_`,
    noCache: true,
  });
}
