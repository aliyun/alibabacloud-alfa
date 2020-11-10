import { VMContext } from '@alicloud/console-os-browser-vm';
import { loadBundle, loadScriptsWithContext } from '@alicloud/console-os-loader';

import { addStyles } from '../misc/style';
import { AppInfo, AppInstance, BasicModule } from '../type';
import { handleManifest, getManifest } from '../misc/manifest';
import { invokeLifeCycle, validateAppInstance, formatUrl, extractModule, getUrlDir } from '../misc/util';

/**
 * Load the app external from url
 * @param {AppInfo} appInfo
 * @param {VMContext} context
 */
export const loadRuntime = async (runtime: BasicModule, context: VMContext) => {
  if (!runtime.url) {
    return Promise.resolve(null);
  }

  return extractModule(
    await loadBundle({
      id: runtime.name,
      url: runtime.url,
      context,
    })
  );
}

const getAppManifestUrl = (appInfo: AppInfo) => {
  if (typeof appInfo.manifest === 'string') {
    return appInfo.manifest;
  }
  return location.href;
}

/**
 * Create an app loader for single spa
 * @param {AppInfo} appInfo App info for os
 * @param {VMContext} context BrowerVM Context
 */
export const createAppLoader = async (appInfo: AppInfo, context: VMContext) => {
  let { name, url } = appInfo;
  let style: string[] | null = null;

  if (appInfo.manifest) {
    // TODO: log manifest
    const manifest = await getManifest(appInfo, appInfo.name);

    if (manifest) {
      // TODO: validate the manifest
      name = manifest.name;

      const { js, css } = handleManifest(manifest);

      if (manifest.runtime) {
        const runtime = await loadRuntime(manifest.runtime, { window, document, location, history });
        if (runtime) {
          appInfo.deps = runtime;
        }
      }

      if (manifest.externals && manifest.externals.length) {
        await loadScriptsWithContext({
          id: name, url: manifest.externals[0], context
        });
      }

      for (var index = 0; index < js.length - 1; index++) {
        await loadScriptsWithContext({
          id: name, url: formatUrl(js[index], getAppManifestUrl(appInfo)), context
        });
      }

      url = formatUrl(js[js.length - 1], getAppManifestUrl(appInfo));

      style = css;
    }
  }

  if (style) {
    addStyles(style, getAppManifestUrl(appInfo))
  }

  const appInstance = extractModule(
    await loadBundle<AppInstance>({
      id: name, url, context, deps: {
        ...(appInfo.deps || {}),
        '@alicloud/console-os-environment': {
          publicPath:  appInfo.publicPath || getUrlDir(url)
        }
      }
    })
  );

  validateAppInstance(appInstance);

  return {
    name,
    bootstrap: [
      ...appInstance.bootstrap,
    ],
    mount: [
      async () => {
        await invokeLifeCycle(appInfo.appWillMount, appInstance);
      },
      ...appInstance.mount,
      async () => {
        await invokeLifeCycle(appInfo.appDidMount, appInstance);
      }
    ],
    unmount: [
      async () => {
        await invokeLifeCycle(appInfo.appWillUnmount, appInstance);
      },
      ...appInstance.unmount,
      async () => {
        await invokeLifeCycle(appInfo.appDidUnmount, appInstance)
      }
    ],
    update: [
      async () => {
        await invokeLifeCycle(appInfo.appWillUpdate, appInstance);
      },
      ...appInstance.update ? appInstance.update : []
    ],
    exposedModule: appInstance.exposedModule
  }
}