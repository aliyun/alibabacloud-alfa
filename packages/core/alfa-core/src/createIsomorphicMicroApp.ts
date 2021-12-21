import { createIsomorphicMicroApp as createOsIsomorphicMicroApp, IIsomorphicEnvironment } from '@alicloud/console-os-kernal';
import { getManifest, getURL, resolveReleaseUrl } from './utils';
import { AlfaFactoryOption, AlfaReleaseConfig, IAppConfig, IOptions } from './types';
import { parseManifestFromRelease } from './resolveAlfaManifest';

export const createIsomorphicMicroApp = <T>(appConfig: IAppConfig<T>, options: IOptions<T> = {}) => {

  const manifest = getManifest(appConfig);
  const url = getURL(appConfig);

  if (!manifest && !url) {
    throw new Error(`No entry or manifest in ${appConfig.name}`);
  }

  return createOsIsomorphicMicroApp({
    name: appConfig.name,
    dom: appConfig.container,
    manifest,
    customProps: appConfig.props,
    deps: appConfig.deps,
    url,

    // @ts-ignore
    appWillMount: options.beforeMount,
    // @ts-ignore
    appDidMount: options.afterMount,
    // @ts-ignore
    appWillUnmount: options.beforeUnmount,
    // @ts-ignore
    appDidUnmount: options.afterUnmount,
    // @ts-ignore
    appWillUpdate: options.beforeUpdate
  }, {
    sandbox: options.sandbox
  });
}

export const renderToString = <T>(props: IAppConfig<T>, env: IIsomorphicEnvironment) => {
  let manifest = props.manifest;

  if (!manifest) {
    const releaseUrl = resolveReleaseUrl(props);
    const releaseJson = env.getJson<AlfaReleaseConfig>(releaseUrl);
    if (!releaseJson) {
      env.fetchJsonResource(releaseUrl);
      return null;
    }

    manifest = parseManifestFromRelease(releaseJson, props);
  }

  const renderString = createIsomorphicMicroApp<T>({...props, manifest: manifest })
    .load(env)
    .mount({customProps: props});

  return renderString;
}
