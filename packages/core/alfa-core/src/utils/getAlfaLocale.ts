import axios from 'axios';

import { resolveReleaseUrl, getAlfaLocale } from './index';
import { AlfaFactoryOption, AlfaReleaseConfig } from '../types';

export const getLocale = async (option: AlfaFactoryOption) => {
  // TODO: cache
  const resp = await axios.get<AlfaReleaseConfig>(resolveReleaseUrl(option));
  const locale = getAlfaLocale();
  const releaseConfig = resp.data;

  const version = releaseConfig['dist-tags']?.['locales-latest'];

  const localeEntry = releaseConfig['locales-versions']?.[version]?.[locale];

  if (!localeEntry) {
    // throw new Error(`${option.name} ${locale} entry is not found, please check you release.`);
  }

  let messages: Record<string, string> = {};

  try {
    const res = await axios.get<Record<string, string>>(localeEntry);
    messages = res.data;
  } catch (e) {
    // Nothing
  }

  return messages;
};
