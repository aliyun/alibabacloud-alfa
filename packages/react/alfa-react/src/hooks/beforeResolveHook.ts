import { IAppConfig, getManifest } from '@alicloud/alfa-core';

import { version as LOADER_VERSION } from '../version';

// get manifest before resolve
// normalize name
async function beforeResolveHook(appConfig: IAppConfig) {
  let { manifest: resolvedManifest } = appConfig;
  const { logger } = appConfig;

  const START_TIME = Date.now();
  const MANIFEST_START_TIME = Date.now();
  if (!resolvedManifest) {
    resolvedManifest = await getManifest(appConfig);
  }
  const MANIFEST_END_TIME = Date.now();

  logger?.record({
    LOADER_VERSION,
    START_TIME,
    MANIFEST_START_TIME,
    MANIFEST_END_TIME,
  });

  appConfig.manifest = resolvedManifest;

  return appConfig;
}

export default beforeResolveHook;
