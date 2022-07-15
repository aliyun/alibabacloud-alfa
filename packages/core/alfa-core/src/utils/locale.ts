import { IWin } from '../types';

const globalLocale = 'en_US';

/**
 * x-X-Y to x_X_Y
 * @param key
 * @returns
 */
const formatLocale = (key: string) => key.replace('-', '_');

/**
 * getLocale
 * @returns
 */
export const getLocale = (key?: string): string => {
  return formatLocale(key || (window as IWin)?.ALIYUN_CONSOLE_CONFIG?.LOCALE || globalLocale);
};
