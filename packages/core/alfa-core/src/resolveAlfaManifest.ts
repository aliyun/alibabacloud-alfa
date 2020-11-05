import axios from 'axios';

import { resolveReleaseUrl } from './utils';
import { AlfaFactoryOption, AlfaReleaseConfig } from './types';

export const getManifestByIdByVersion = async (option: AlfaFactoryOption) => {
  // TODO: cache the manifest
  const resp = await axios.get<AlfaReleaseConfig>(resolveReleaseUrl(option));
  const releaseConfig = resp.data;

  const configByVersion = releaseConfig.versions[option.version];

  if (!configByVersion) {
    throw new Error(`${option.name}@${option.version} is not found, please check you release.`)
  }

  return releaseConfig.versions[option.version].entry;
}