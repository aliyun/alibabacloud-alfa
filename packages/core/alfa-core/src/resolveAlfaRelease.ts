import axios from 'axios';

import { resolveReleaseUrl } from './utils';
import { AlfaFactoryOption, AlfaReleaseConfig } from './types';

export const getRelease = async (option: AlfaFactoryOption) => {
  // TODO: cache the manifest
  const resp = await axios.get<AlfaReleaseConfig>(resolveReleaseUrl(option));
  // const releaseConfig = resp.data;
};
