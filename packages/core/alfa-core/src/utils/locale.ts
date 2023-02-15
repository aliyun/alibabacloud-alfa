import { getCookie } from '@alicloud/cookie';

import { IWin } from '../types';

const globalLocale = 'en_US';

const localeMap: Record<string, string> = {
  zh: 'zh_CN',
  en: 'en_US',
  ja: 'ja_JP',
  'zh-TW': 'zh_TW',
  ko: 'ko_KR',
  fr: 'fr_FR',
  de: 'de_DE',
};

const getLocaleFromCookie = () => {
  const lang = getCookie('aliyun_lang');

  return lang && localeMap[lang];
};

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
  return formatLocale(
    key || (window as IWin)?.ALIYUN_CONSOLE_CONFIG?.LOCALE || getLocaleFromCookie() || globalLocale,
  );
};
