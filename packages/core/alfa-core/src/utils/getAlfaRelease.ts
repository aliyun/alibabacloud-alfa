import { resolveReleaseUrl } from '.';
import cache from './cacheManager';
import { IAppConfig, AlfaReleaseConfig } from '../types';

export const getRelease = async (config: IAppConfig) => {
  const { name } = config;

  try {
    const releaseConfig = await cache.getRemote<AlfaReleaseConfig>(resolveReleaseUrl(config));

    return releaseConfig;
  } catch (e) {
    throw new Error(`${name} releaseConfig loading failed, please try again or connect developers.`);
  }
};
