import { getRelease } from './getAlfaRelease';
import { IAppConfig } from '../types';

export const getManifest = async (config: IAppConfig) => {
  const { name } = config;

  let { version } = config;

  const releaseConfig = await getRelease(config);

  if (!config.version) {
    version = releaseConfig['dist-tags']?.latest;
  }

  // if version is in dist-tags, return value
  if (releaseConfig['dist-tags']?.[config.version]) {
    version = releaseConfig['dist-tags'][config.version];
  }

  const configByVersion = releaseConfig.versions[version];

  if (!configByVersion) {
    throw new Error(`${name}@${version} is not found, please check you release.`);
  }

  return releaseConfig.versions[version].entry;
};
