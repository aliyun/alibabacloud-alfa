import { AlfaEnvConfig, EnvEnum } from '../types'

const cdnReleaseUrl = 'https://cws.alicdn.com/release.json';
const cdnPrepubUrl = 'https://cws.aliyun-inc.com/release.json';
const cdnReleaseConfigUrl = 'https://cws.alicdn.com/Release/pkgs/${id}/config.json';
const cdnPrepubConfigUrl = 'https://cws.aliyun-inc.com/Release/pkgs/${id}/config.json';
const resourceProdUrl = 'https://g.alicdn.com/${id}/${version}/index.js';
const resourceDailyUrl = 'https://dev.g.alicdn.com/${id}/${version}/index.js';

export const ENV: AlfaEnvConfig = {
  local: {
    releaseUrl: process.env.ALFA_RELEASE_URL || cdnPrepubUrl,
    configUrl: cdnPrepubConfigUrl,
    resourceUrl: resourceDailyUrl
  },
  daily: {
    releaseUrl: cdnPrepubUrl,
    configUrl: cdnPrepubConfigUrl,
    resourceUrl: resourceDailyUrl
  },
  pre: {
    releaseUrl: cdnPrepubUrl,
    configUrl: cdnPrepubConfigUrl,
    resourceUrl: resourceDailyUrl
  },
  prod: {
    releaseUrl: cdnReleaseUrl,
    configUrl: cdnReleaseConfigUrl,
    resourceUrl: resourceProdUrl
  }
}

export const getConsoleEnv = (): EnvEnum => {
  if (process.env.NODE_ENV === 'development') {
    return 'local';
  }
  // @ts-ignore
  return window?.ALIYUN_CONSOLE_CONFIG?.fEnv || 'prod'
}