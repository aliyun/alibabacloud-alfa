import type { AxiosRequestConfig } from 'axios';

// 兼容非公有云环境
const getCurrentCdnHost = () => {
  try {
    const { hostname } = new URL((document.currentScript as HTMLScriptElement)?.src || '');
    const parts = hostname.split('.');

    return parts.length > 2 ? parts.slice(-2).join('.') : hostname;
  } catch (e) {
    return undefined;
  }
};

export default async function requestInterceptor(config: AxiosRequestConfig) {
  const hostname = getCurrentCdnHost();
  // if cdn is not alicdn, replace it
  if (hostname && config.url) {
    // 非公有云下无 cws2
    config.url = config.url.replace(new RegExp('.alicdn.com'), `.${hostname}`).replace('cws2.', 'cws.');
  }

  return config;
}
