import axios from 'axios';

import { resolveReleaseUrl } from '.';
import { AlfaFactoryOption, AlfaReleaseConfig } from '../types';

export const getManifest = async (option: AlfaFactoryOption) => {
  // TODO: cache
  const resp = await axios.get<AlfaReleaseConfig>(resolveReleaseUrl(option));
  const releaseConfig = resp.data;

  let { version } = option;

  if (!option.version) {
    version = releaseConfig['dist-tags']?.latest;
  }

  // if version is in dist-tags, return value
  if (releaseConfig['dist-tags']?.[option.version]) {
    version = releaseConfig['dist-tags'][option.version];
  }

  const configByVersion = releaseConfig.versions[version];

  if (!configByVersion) {
    throw new Error(`${option.name}@${version} is not found, please check you release.`);
  }

  return releaseConfig.versions[version].entry;
};
