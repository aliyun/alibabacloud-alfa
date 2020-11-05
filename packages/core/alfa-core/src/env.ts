import { AlfaEnvConfig } from './types'

const cdnUrl = 'https://cws.alicdn.com/Release/alfa/${appId}/release.json';
const cdnPreUrl = 'https://cws2.alicdn.com/Prepub/alfa/${appId}/release.json';

export const ENV: AlfaEnvConfig = {
  local: {
    releaseUrl: process.env.ALFA_RELEASE_URL || cdnPreUrl,
    cdnBackupUrl: cdnUrl
  },
  daily: {
    releaseUrl: cdnPreUrl,
    cdnBackupUrl: cdnPreUrl
  },
  pre: {
    releaseUrl: cdnPreUrl,
    cdnBackupUrl: cdnPreUrl
  },
  prod: {
    releaseUrl: cdnUrl,
    cdnBackupUrl: cdnUrl
  }
}

export const getConsoleEnv = () => {
  if (process.env.NODE_ENV === 'development') {
    return 'local';
  }
  // @ts-ignore
  return window?.ALIYUN_CONSOLE_CONFIG?.fEnv || 'prod'
}