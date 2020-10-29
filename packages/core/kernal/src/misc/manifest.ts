import axios from 'axios';
import { AppManifest } from '../type';
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
export const getManifest = async (url: string, id?: string) => {
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

  let acturalUrl = url;
  try {
    // dev 环境 请求本地服务
    if (process.env.NODE_ENV === 'development' && process.env.ENABLE_MICRO_APP_REGISTER_URL) {
      const appConfig = await axios.get(`${process.env.MICRO_APP_REGISTERY_URI || '/__get_micro_app__'}?id=${id}&manifest=${url}`)
      // @ts-ignore
      acturalUrl = appConfig.manifest || acturalUrl;
    }
    const manifest = await getFromCdn(acturalUrl) as AppManifest;
    manifestInfo.loaded = true;
    manifestInfo.loading = false;
    manifestInfo.resolve(manifest);
    return manifest;
  } catch (e) {
    const error = LoggerFactory.manifest(e, {
      url: acturalUrl
    });
    manifestInfo.reject(error);
    throw error;
  }
}