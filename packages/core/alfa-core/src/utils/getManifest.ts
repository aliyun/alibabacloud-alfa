import { getRelease } from './getRelease';
import { AlfaReleaseConfig, IAppConfig } from '../types';
import cache from './cacheManager';
import { getRelativePath, getFeatureStatus } from './index';

type Manifest = Exclude<IAppConfig['manifest'], string | undefined>;

const formatURL = (origin: string, base: string) => {
  // incorrect: new URL('../b', 'https://example.com/a/c') => https://example.com/b
  // correct: new URL('../b', 'https://example.com/a/c/') => https://example.com/a/b
  return new URL(origin, base.endsWith('/') ? base : `${base}/`).toString();
};

/**
 * format url in manifest json
 * @param manifest
 */
const formatManifest = (manifestContent: Manifest, inputManifestUrl: string, realManifestUrl: string): Manifest => {
  const { name, resources, runtime, externals, entrypoints } = manifestContent;

  const entrypoint = Object.keys(entrypoints)[0];

  return {
    name,
    resources: Object.keys(resources).reduce<Record<string, string>>((map, key) => {
      map[key] = formatURL(getRelativePath(inputManifestUrl, resources[key]), realManifestUrl);

      return map;
    }, {}),
    runtime,
    externals,
    entrypoints: {
      [entrypoint]: {
        css: entrypoints[entrypoint].css?.map((url) => formatURL(getRelativePath(inputManifestUrl, url), realManifestUrl)),
        js: entrypoints[entrypoint].js.map((url) => formatURL(getRelativePath(inputManifestUrl, url), realManifestUrl)),
      },
    },
  };
};

export const getManifest = async (config: IAppConfig) => {
  const latestVersion = 'latest';
  const { manifest, logger } = config;

  let entry: string | undefined;
  let releaseConfig: AlfaReleaseConfig | undefined;

  // if user has custom manifest
  if (manifest) {
    if (typeof manifest !== 'string') return manifest;

    entry = manifest;
  } else {
    let { version = latestVersion } = config;
    releaseConfig = await getRelease(config);

    if (version) {
      // version maybe tag
      if (releaseConfig['dist-tags']?.[version]) {
        const nextDistTag = releaseConfig['next-dist-tags']?.[version];
        const grayVersion = nextDistTag?.version;

        version = releaseConfig['dist-tags'][version] || '';

        // return gray version when featStatus is true
        if (grayVersion) {
          const feat = nextDistTag?.featureStatus;

          if (getFeatureStatus(feat)) version = grayVersion;
        }
      }

      entry = releaseConfig.versions?.[version]?.entry;

      // modify version in config
      config.version = version;
    }
  }

  if (!entry) return undefined;

  try {
    const { config: requestConfig, data } = await cache.getRemote<Manifest>(entry);

    logger?.setContext && logger.setContext({
      manifest: JSON.stringify(data),
    });

    return formatManifest(data, entry, requestConfig.url || entry);
  } catch (e) {
    logger?.error && logger.error({ E_CODE: 'GetManifestError', E_MSG: (e as Error).message, data: JSON.stringify(releaseConfig) });
    return undefined;
  }
};
