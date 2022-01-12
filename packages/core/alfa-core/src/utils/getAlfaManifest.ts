import { getRelease } from './getAlfaRelease';
import { IAppConfig } from '../types';

export const getManifest = async (config: IAppConfig) => {
  const { name, logger } = config;

  let { version } = config;

  const releaseConfig = await getRelease(config);
  const latestVersion = releaseConfig['dist-tags']?.latest;

  // if version is in dist-tags, return value
  if (releaseConfig['dist-tags']?.[version]) {
    version = releaseConfig['dist-tags'][version];
  }

  let versionEntry = releaseConfig.versions?.[version];

  if (!versionEntry) {
    logger?.error({ E_MSG: `cannot find ${name}@${version}.` });

    versionEntry = releaseConfig.versions?.[latestVersion];

    if (!versionEntry) throw new Error(`cannot find ${name}@latest, please check release.`);
  }

  return versionEntry.entry;
};
