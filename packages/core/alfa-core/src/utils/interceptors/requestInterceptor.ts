import type { AxiosRequestConfig } from 'axios';

const whiteList = ['alicdn.com', 'idptcloud01cdn.com'];

const win = window as { __alfa_cdn_host__?: string };

// 兼容非公有云环境
const getCurrentCdnHost = () => {
  try {
    // 逻辑上所有的微应用 cdn 都是同一个 host，所以可以复用同一个全局变量
    if (win.__alfa_cdn_host__) {
      return win.__alfa_cdn_host__;
    }

    // document.currentScript 可能为 null
    const { hostname } = new URL((document.currentScript as HTMLScriptElement)?.src || '');
    const parts = hostname.split('.');

    const currentCdnHost = parts.length > 2 ? parts.slice(-2).join('.') : hostname;

    if (!win.__alfa_cdn_host__) {
      win.__alfa_cdn_host__ = currentCdnHost;
    }

    return currentCdnHost;
  } catch (e) {
    return undefined;
  }
};

const currentCdnHost = getCurrentCdnHost();

// 根据不同环境替换 cdn 的域名
export default async function requestInterceptor(config: AxiosRequestConfig) {
  if (currentCdnHost && currentCdnHost !== 'alicdn.com' && whiteList.includes(currentCdnHost)) {
    // if cdn is not alicdn, replace it
    if (config.url) {
      config.url = config.url
        .replace(new RegExp('.alicdn.com'), `.${currentCdnHost}`)
        .replace('cws2.', 'cws.') // 非公有云下无 cws2
        .replace('dev.g.idptcloud01cdn.com', 'dev-g.idptcloud01cdn.com'); // idptcloud01cdn 无 dev.g 子域名
    }
  }

  return config;
}
