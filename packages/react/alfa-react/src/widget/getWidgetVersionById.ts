import template from 'lodash/template';
import { IWin, request, AlfaReleaseConfig } from '@alicloud/alfa-core';

import { WidgetFactoryOption, WidgetReleaseConfig } from '../types';
import { ENV, DIS_ENV, getConsoleEnv } from './env';

export let cachedRelease: Record<string, any> | null = null;

const WIDGET_ENTRY_URL = 'https://g.alicdn.com/${id}/${version}/index.js';

const uid = (window as IWin).ALIYUN_CONSOLE_CONFIG?.MAIN_ACCOUNT_PK;

const normalizeEntryUrl = (id: string, version?: string, resourceUrl?: string) => {
  if (!version) throw new Error('No Version for Widget');

  const gitRepoId = id.replace('@ali/', '').replace('widget-', 'widget/');
  return template(resourceUrl)({ id: gitRepoId, version });
};

export const getWidgetVersionById = async (option: WidgetFactoryOption) => {
  const { name, central = true, env } = option;

  const Release = central ? ENV[env || getConsoleEnv()] : DIS_ENV[env || getConsoleEnv()];
  if (!option.version) {
    throw new Error('No Version for Widget');
  }

  if (!option.version.endsWith('.x')) {
    return {
      version: option.version,
      entryUrl: normalizeEntryUrl(option.name, option.version, Release.resourceUrl || WIDGET_ENTRY_URL),
    };
  }

  let version;
  let entryUrl;

  // if central is true, get cws.alicdn.com/release.json firstly
  if (central) {
    if (!cachedRelease) {
      const resp = await request.get<WidgetReleaseConfig>(Release.releaseUrl);
      if (resp && resp.data) {
        cachedRelease = resp.data;
      }
    }
  }

  if (cachedRelease) {
    const latestVersion = cachedRelease[option.name][option.version].latest;
    const nextVersion = cachedRelease[option.name][option.version].next?.version;
    const gray = cachedRelease[option.name][option.version].next?.gray;

    version = (uid && Number(uid.substring(uid.length - 2)) < gray) ? nextVersion : latestVersion;
    entryUrl = normalizeEntryUrl(option.name, version, Release.resourceUrl || WIDGET_ENTRY_URL);

    return {
      version,
      entryUrl,
    };
  }

  const resp = await request.get<AlfaReleaseConfig>(template(Release.releaseUrl)({ id: name }));
  if (!resp || !resp.data) throw new Error('Cannot get Release');
  const release = resp.data;

  const nextVersion = release['dist-tags']?.[`${option.version}-next`];
  version = release['dist-tags']?.[option.version];

  // has gray version
  if (nextVersion && release?.['next-versions']?.[nextVersion] && uid) {
    const sampling = release['next-versions'][nextVersion].featureStatus.sampling || 0;
    if (sampling * 100 > Number(uid.substring(uid.length - 2))) {
      version = nextVersion;
    }
  }

  entryUrl = normalizeEntryUrl(option.name, version, Release.resourceUrl || WIDGET_ENTRY_URL);

  return {
    version,
    entryUrl,
  };
};
