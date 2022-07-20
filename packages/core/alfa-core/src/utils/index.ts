import { IAppConfig } from '../types';

export { getEnv } from './env';
export { getLocale } from './locale';

export const getURL = (appConfig: IAppConfig) => {
  const { entry } = appConfig;
  let url = '';

  if (typeof entry === 'string') {
    url = entry;
  }

  return url;
};

export const getManifestFromConfig = (appConfig: IAppConfig) => {
  // 定义了 entry 时，优先从 entry 生成 manifest
  if (appConfig.entry && typeof appConfig.entry !== 'string') {
    return {
      name: appConfig.name,
      resources: {},
      entrypoints: {
        index: {
          js: appConfig.entry.scripts,
          css: appConfig.entry.styles || [],
        },
      },
    };
  }

  return appConfig.manifest;
};

function trimArray(arr: Array<string>) {
  const lastIndex = arr.length - 1;
  let start = 0;
  for (; start <= lastIndex; start++) {
    if (arr[start])
      break;
  }

  let end = lastIndex;
  for (; end >= 0; end--) {
    if (arr[end])
      break;
  }

  if (start === 0 && end === lastIndex)
    return arr;
  if (start > end)
    return [];
  return arr.slice(start, end + 1);
}

/**
 * return relative path or full url
 * @param from 
 * @param to 
 * @param base 
 * @returns 
 */
export const getRelativePath = (from: string, to: string, base?: string) => {
  const { host: fromHost, pathname: fromPath } = new URL(from, base || from);
  const { host: toHost, pathname: toPath } = new URL(to, base || from);

  // from 'g.alicdn.com' to 'dev.g.alicdn.com' regarded as same host
  if (fromHost !== toHost && (toHost !== 'g.alicdn.com' || fromHost !== 'dev.g.alicdn.com')) return to;

  const fromParts = trimArray(fromPath.split('/'));
  const toParts = trimArray(toPath.split('/'));
  const length = Math.min(fromParts.length, toParts.length);
  let samePartsLength = length;

  for (var i = 0; i < length; i++) {
    if (fromParts[i] !== toParts[i]) {
      samePartsLength = i;
      break;
    }
  }

  const outputParts = [];

  for (var i = samePartsLength; i < fromParts.length; i++) {
    outputParts.push('..');
  }

  return outputParts.concat(toParts.slice(samePartsLength)).join('/');
}