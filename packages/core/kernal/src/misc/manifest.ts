import { AppManifest } from '../type';
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
  return await getFromCdn(url) as AppManifest;
}