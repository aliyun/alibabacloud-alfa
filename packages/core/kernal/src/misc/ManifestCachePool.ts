import LRU from 'lru-cache';
import { AppManifest } from '../type';

interface ManifestInfo {
  resolve: (value: AppManifest | PromiseLike<AppManifest>) => Promise<AppManifest> | void;
  reject: (reason?: any) => Promise<AppManifest> | void;
  promise: Promise<AppManifest>;
  loaded: boolean;
  loading: boolean;
  manifest: any;
}

let cache: LRU<string, ManifestInfo> = null;

/**
 * using cache pools
 * @param option
 */
export function createCachePool() {
  cache = new LRU<string, ManifestInfo>({
    max: 30,
  });
}

/**
 * get application cache by app id
 * @param id
 */
export function getAppManifest(id: string) {
  return cache.get(id);
}

/**
 * set application cache by app id
 * @param id
 */
export function setAppManifest(id: string, manifestInfo: ManifestInfo) {
  cache.set(id, manifestInfo);
}
