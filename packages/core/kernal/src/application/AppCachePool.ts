import LRU from 'lru-cache';
import { Application } from './Application';

let cache: LRU<string, Application> = null;

/**
 * using cache pools
 * @param option 
 */
export function createCachePool(option) {
  cache = new LRU<string, Application>({
    max: option.max || 10,
    dispose: (key, app) => {
      app.dispose();
    }
  })
}

/**
 * get application cache by app id
 * @param id 
 */
export function getApp(id: string) {
  return cache.get(id);
}

/**
 * set application cache by app id
 * @param id 
 */
export function setApp(id: string, app: Application) {
  cache.set(id, app);
}
