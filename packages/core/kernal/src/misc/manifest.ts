import axios from 'axios';
import { AppInfo, AppManifest } from '../type';
import * as ManifestCachePool from './ManifestCachePool';
import { getFromCdn } from './util';
import { LoggerFactory } from './logger'

export const handleManifest = (manifest: AppManifest) => {
  const entrypoints = manifest.entrypoints;

  const entrypointsArr = Object.values(entrypoints);
  if (entrypointsArr.length > 1) {
    /* eslint-disable */
    console.error(`invalid manifest, entrypoints for manifest show contain one key`);
  }
  return entrypointsArr[0];
}

/**
 * 
 * @param url 
 */
export const getManifest = async (appInfo: AppInfo, id?: string) => {
  const manifest = appInfo.manifest;
  if(typeof manifest !== 'string') {
    return manifest;
  }

  const url = manifest;
  let manifestInfo = ManifestCachePool.getAppManifest(url);

  if(manifestInfo && manifestInfo.loaded) {
    return manifestInfo.manifest;
  }

  if (!manifestInfo || !manifestInfo.loaded) {
    if (manifestInfo) {
      return manifestInfo.promise;
    } else {
      const promise = new Promise<AppManifest>(function(resolve, reject) {
        manifestInfo = {
          resolve: resolve,
          reject: reject,
          manifest: null,
          loading: true,
          loaded: false,
          promise: promise,
        }
        ManifestCachePool.setAppManifest(url, manifestInfo);
      });
      manifestInfo.promise = promise;
    }
  }

  let actualUrl = url;
  try {
    // dev 环境 请求本地服务
    if (process.env.NODE_ENV === 'development' && process.env.ENABLE_MICRO_APP_REGISTRY_URL) {
      const appConfig = await axios.get(`${process.env.MICRO_APP_REGISTRY_URI || '/__get_micro_app__'}?id=${id}&manifest=${url}`)
      // @ts-ignore
      actualUrl = appConfig.data.manifest || actualUrl;
      appInfo.manifest = actualUrl;
    }
    const manifest = await getFromCdn(actualUrl) as AppManifest;
    manifestInfo.manifest = manifest;
    manifestInfo.loaded = true;
    manifestInfo.loading = false;
    manifestInfo.resolve(manifest);
    return manifest;
  } catch (e) {
    const error = LoggerFactory.manifest(e, {
      url: actualUrl
    });
    manifestInfo.reject(error);
    throw error;
  }
}