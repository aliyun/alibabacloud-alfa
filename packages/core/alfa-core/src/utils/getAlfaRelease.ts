import { resolveReleaseUrl } from '.';
import cache from './cacheManager';
import { IAppConfig, AlfaReleaseConfig } from '../types';

export const getRelease = async (config: IAppConfig) => {
  const { logger } = config;

  try {
    const releaseConfig = await cache.getRemote<AlfaReleaseConfig>(resolveReleaseUrl(config));

    return releaseConfig;
  } catch (e) {
    logger?.error && logger.error({
      E_CODE: 'GetReleaseError',
      E_MSG: e.message,
    });
  }

  return {};
};
