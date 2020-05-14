import { loadBundle, loadScriptsWithContext } from '@alicloud/console-os-loader';

import { addStyles } from '../misc/style';
import { AppInfo, AppInstance, BasicModule } from '../type';
import { handleManifest, getManifest } from '../misc/manifest';
import { invokeLifeCycle, validateAppInstance, formatUrl, extractModule } from '../misc/util';

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
      id: runtime.id,
      url: runtime.url,
      context,
    })
  );
}

/**
 * Create an app loader for single spa
 * @param {AppInfo} appInfo App info for os
 * @param {VMContext} context BrowerVM Context
 */
export const createAppLoader = async (appInfo: AppInfo, context: VMContext) => {
  let { id, url } = appInfo;
  let style: string[] | null = null;

  if (appInfo.manifest) {
    // TODO: log manifest
    const manifest = await getManifest(appInfo.manifest);
    if (manifest) {
      // TODO: validate the manifest
      id = manifest.name;

      const { js, css } = handleManifest(manifest);

      // TODO: log runtime
      if (manifest.runtime) {
        const runtime = await loadRuntime(manifest.runtime, { window, document, location, history });
        if (runtime) {
          appInfo.deps = runtime;
        }
      }

      manifest.externals && await loadScriptsWithContext({
        id, url: manifest.externals[0], context
      });

      for (var index = 0; index < js.length - 1; index++) {
        await loadScriptsWithContext({
          id, url: js[index], context
        });
      }

      url = formatUrl(js[js.length - 1], appInfo.manifest);

      style = css;
    }
  }

  if (style) {
    addStyles(style, appInfo.manifest)
  }

  const appInstance = extractModule(
    await loadBundle<AppInstance>({
      id, url, context, deps: appInfo.deps
    })
  );

  validateAppInstance(appInstance);

  return {
    id,
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
      ...appInstance.update ? appInstance.update : []
    ]
  }
}