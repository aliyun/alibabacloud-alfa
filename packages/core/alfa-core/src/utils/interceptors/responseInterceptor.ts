import axios, { AxiosResponse, AxiosError } from 'axios';
import { AppManifest } from '@alicloud/console-os-kernal/lib/type';

import { AlfaReleaseConfig, AlfaDynamicConfig } from '../../types';

function isManifest(url: string, data?: AppManifest) {
  if (/\/manifest.json$/.exec(url) && data) {
    if (data.name && data.entrypoints && data.resources) {
      return true;
    }
  }

  return false;
}

function isRelease(url: string, data?: AlfaReleaseConfig) {
  if (/\/release.json$/.exec(url) && data) {
    const latestVersion = data['dist-tags']?.latest;
    const entryFile = data.versions?.entry;

    if (latestVersion && entryFile) return true;
  }

  return false;
}

function isConfig(url: string, data: AlfaDynamicConfig) {
  if (/\/config.json/.exec(url) && data) {
    if ('ALL_CHANNEL_LINKS' in data && 'ALL_CHANNEL_FEATURE_STATUS' in data && 'ALL_FEATURE_STATUS' in data) return true;
  }

  return false;
}

function isLocale(url: string) {
  // will not check locale file content
  if (/\/(zh_CN|zh_TW|ja_JP|en_US)/.exec(url)) return true;

  return false;
}

function isLegal(url?: string, data?: any) {
  // data is an object and not empty
  if (url && data && Object.prototype.toString.call(data) === '[object Object]' && Object.keys(data).length > 0) {
    if (isManifest(url, data) || isRelease(url, data) || isConfig(url, data) || isLocale(url)) {
      return true;
    }
  }
  return false;
}

// check response content after networkErrorInterceptor
// if it legal, cache it
// if it is illegal, fallback cws.alicdn.com to cws2.alicdn.com.
export default async function responseInterceptor(response: AxiosResponse<any>) {
  const { data, config } = response;
  const { url } = config;

  // check data is legal object JSON
  if (isLegal(url, data)) {
    return response;
  } else {
    config.url = url?.replace(/:\/\/cws\.alicdn\.com\//, '://cws2.alicdn.com/');
    const newResponse = await axios(config);

    if (isLegal(url, newResponse.data)) {
      return newResponse;
    }
  }

  const error = new Error() as AxiosError;
  error.code = '0';
  error.config = config;
  error.response = response;

  throw error;
}
