import cache from './cacheManager';
import { IAppConfig, AlfaReleaseConfig } from '../types';
import { getEnv } from './env';

/**
 * get alfa release url
 * @param appId
 * @param env
 * @returns
 */
export const getReleaseUrl = (name?: string, env?: string): string | undefined => {
  const cdnUrl = `https://cws.alicdn.com/Release/alfa/${name}/release.json`;
  const cdnPreUrl = `https://cws2.alicdn.com/Prepub/alfa/${name}/release.json`;

  switch (env) {
    case 'local':
      return (process.env.ALFA_RELEASE_URL) as string || cdnPreUrl;
    case 'daily':
      return cdnPreUrl;
    case 'pre':
      return cdnPreUrl;
    case 'prod':
      return cdnUrl;
    default:
      break;
  }

  return undefined;
};

export const getRelease = async (config: IAppConfig) => {
  const { logger, name } = config;

  const env = getEnv(config.env);

  try {
    const releaseConfig = (await cache.getRemote<AlfaReleaseConfig>(getReleaseUrl(name, env))).data;

    if (!releaseConfig) throw new Error('releaseConfig is null');

    logger?.setContext && logger.setContext({
      release: JSON.stringify(releaseConfig),
    });

    return releaseConfig;
  } catch (e) {
    logger?.error && logger.error({
      E_CODE: 'GetReleaseError',
      E_MSG: e.message,
    });
  }

  return {};
};
