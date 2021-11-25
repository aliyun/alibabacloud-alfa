import axios from 'axios';
import template from 'lodash/template';

import { WidgetFactoryOption, WidgetReleaseConfig } from '../types';
import { ENV, getConsoleEnv } from './env';

export let cachedRelease: Record<string, any> | null = null;

const WIDGET_ENTRY_URL = 'https://g.alicdn.com/${id}/${version}/index.js';

const normalizeEntryUrl = (id: string, version: string, resourceUrl: string) => {
  const gitRepoId = id.replace('@ali/', '').replace('widget-', 'widget/');
  return template(resourceUrl)({ id: gitRepoId, version });
};

export const getWidgetVersionById = async (option: WidgetFactoryOption) => {
  const env = ENV[option.env || getConsoleEnv()];
  if (!option.version) {
    throw new Error('No Version for Widget');
  }

  if (!option.version.endsWith('.x')) {
    return {
      version: option.version,
      entryUrl: normalizeEntryUrl(option.name, option.version, env.resourceUrl || WIDGET_ENTRY_URL),
    };
  }

  if (!cachedRelease) {
    const resp = await axios.get<WidgetReleaseConfig>(env.releaseUrl);
    cachedRelease = resp.data;
  }

  const version = cachedRelease[option.name][option.version].latest;

  return {
    version,
    entryUrl: normalizeEntryUrl(option.name, version, env.resourceUrl || WIDGET_ENTRY_URL),
  };
};
