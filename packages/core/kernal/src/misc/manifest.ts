import { AppManifest } from '../type';
import * as ManifestCachePool from './ManifestCachePool';
import { getFromCdn } from './util';

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
export const getManifest = async (url: string) => {
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

  try {
    const manifest = await getFromCdn(url) as AppManifest;
    manifestInfo.loaded = true;
    manifestInfo.loading = false;
    manifestInfo.resolve(manifest);
    return manifest;
  } catch (e) {
    console.error(e, '11111111111111')
    manifestInfo.reject(e);
    throw e;
  }
}