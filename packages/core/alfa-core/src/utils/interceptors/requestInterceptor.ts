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

const currentCdnHost = getCurrentCdnHost();

export default async function requestInterceptor(config: AxiosRequestConfig) {
  if (currentCdnHost !== 'alicdn.com') {
    // if cdn is not alicdn, replace it
    if (currentCdnHost && config.url) {
      config.url = config.url
        .replace(new RegExp('.alicdn.com'), `.${currentCdnHost}`)
        .replace('cws2.', 'cws.') // 非公有云下无 cws2
        .replace('dev.g.idptcloud01cdn.com', 'dev-g.idptcloud01cdn.com'); // idptcloud01cdn 无 dev.g 子域名
    }
  }

  return config;
}
