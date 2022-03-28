import { getRelease } from './getAlfaRelease';
import { IAppConfig } from '../types';
import cache from './cacheManager';

export const getManifest = async (config: IAppConfig) => {
  const releaseConfig = await getRelease(config);
  const latestVersion = releaseConfig['dist-tags']?.latest;
  const { manifest, logger } = config;

  let entry = '';

  // if user has custom manifest
  if (manifest) {
    if (typeof manifest !== 'string') return manifest;

    entry = manifest;
  } else {
    let { version = latestVersion } = config;

    if (version) {
      // if version is in dist-tags, return value
      if (releaseConfig['dist-tags']?.[version]) {
        version = releaseConfig['dist-tags'][version] || '';
      }

      entry = releaseConfig.versions?.[version].entry || '';
    }
  }

  try {
    const result = await cache.getRemote(entry);
    return result;
  } catch (e) {
    logger?.error && logger.error({ E_CODE: 'GetManifestError', E_MSG: e.message });
  }

  return {};
};
