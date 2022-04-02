import { getRelease } from './getRelease';
import { IAppConfig } from '../types';
import cache from './cacheManager';

type Manifest = Exclude<IAppConfig['manifest'], string | undefined>;

const devHostname = '//dev.g.alicdn.com/';

const replaceHost = (origin: string) => {
  return origin.replace('//g.alicdn.com/', devHostname);
};

/**
 * format url in manifest json
 * @param manifest
 */
const formatManifest = (manifestContent: Manifest, manifestUrl: string): Manifest => {
  if (manifestUrl.indexOf(devHostname) === -1) return manifestContent;

  const { name, resources, runtime, externals, entrypoints } = manifestContent;

  const entrypoint = Object.keys(entrypoints)[0];

  return {
    name,
    resources: Object.keys(resources).reduce<Record<string, string>>((map, key) => {
      map[key] = replaceHost(resources[key]);

      return map;
    }, {}),
    runtime,
    externals,
    entrypoints: {
      [entrypoint]: {
        css: entrypoints[entrypoint].css?.map(replaceHost),
        js: entrypoints[entrypoint].js.map(replaceHost),
      },
    },
  };
};

export const getManifest = async (config: IAppConfig) => {
  const releaseConfig = await getRelease(config);
  const latestVersion = releaseConfig['dist-tags']?.latest;
  const { manifest, logger } = config;

  let entry = '';

  // if user has custom manifest
  if (manifest) {
    if (typeof manifest !== 'string') return manifest;

    entry = manifest;
  } else {
    let { version = latestVersion } = config;

    if (version) {
      // if version is in dist-tags, return value
      if (releaseConfig['dist-tags']?.[version]) {
        version = releaseConfig['dist-tags'][version] || '';
      }

      entry = releaseConfig.versions?.[version].entry || '';
    }
  }

  try {
    const result = await cache.getRemote<Manifest>(entry);

    logger?.setContext && logger.setContext({
      manifest: JSON.stringify(result),
    });

    return formatManifest(result, entry);
  } catch (e) {
    logger?.error && logger.error({ E_CODE: 'GetManifestError', E_MSG: e.message, data: JSON.stringify(releaseConfig) });
  }

  return '';
};
