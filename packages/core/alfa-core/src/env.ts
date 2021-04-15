import { AlfaEnvConfig } from './types'

const cdnUrl = 'https://cws.alicdn.com/Release/alfa/${appId}/release.json';
const cdnPreUrl = 'https://cws2.alicdn.com/Prepub/alfa/${appId}/release.json';

const configUrl = 'https://cws.alicdn.com/Release/alfa-products/${appId}/config.json';
const configPreUrl = 'https://cws2.alicdn.com/Prepub/alfa-products/${appId}/config.json';

export const ENV: AlfaEnvConfig = {
  local: {
    releaseUrl: process.env.ALFA_RELEASE_URL || cdnPreUrl,
    cdnBackupUrl: cdnUrl,
    configUrl: configPreUrl,
  },
  daily: {
    releaseUrl: cdnPreUrl,
    cdnBackupUrl: cdnPreUrl,
    configUrl: configPreUrl,
  },
  pre: {
    releaseUrl: cdnPreUrl,
    cdnBackupUrl: cdnPreUrl,
    configUrl: configPreUrl,
  },
  prod: {
    releaseUrl: cdnUrl,
    cdnBackupUrl: cdnUrl,
    configUrl: configUrl,
  }
}


export const getConsoleEnv = () => {
  if (process.env.NODE_ENV === 'development') {
    return 'local';
  }
  // @ts-ignore
  return window?.ALIYUN_CONSOLE_CONFIG?.fEnv || 'prod'
}