import type { AxiosRequestConfig } from 'axios';

// 支持的主权云 CDN Host
// @ts-ignore
const whiteList = ['idptcloud01cdn.com', window.ALIYUN_CONSOLE_CONFIG?.MAIN_RESOURCE_CDN || 'alicdn.com'];

const win = window as { __alfa_cdn_host__?: string };

// 兼容非公有云环境，用于替换请求的 hostname
const getCurrentCdnHost = () => {
  try {
    // 逻辑上所有的微应用 cdn 都是同一个 host，所以可以复用同一个全局变量
    if (win.__alfa_cdn_host__) {
      return win.__alfa_cdn_host__;
    }

    let scriptUrl = (document.currentScript as HTMLScriptElement)?.src;

    if (!scriptUrl) {
      scriptUrl = (new Error('')).stack?.toString().match(/(https?:\/\/[^\s]+)/)?.[1] as string;
    }

    // document.currentScript 可能为 null
    const { hostname } = new URL(scriptUrl);
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

// 如果 host 被 o2 插件替换，则可以被用来判断是否需要替换 cdnHost
const gCdnHost = '//g.alicdn.com/';

// 根据不同环境替换 cdn 的域名
export default async function requestInterceptor(config: AxiosRequestConfig) {
  if (currentCdnHost && currentCdnHost !== 'alicdn.com' && (whiteList.includes(currentCdnHost) || gCdnHost.includes(currentCdnHost))) {
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
