import { loadBundle } from '@alicloud/console-os-loader';
import { getFromCdn, invokeLifeCycle, getRealUrl, validateAppInstance } from './util';

import { AppInfo, AppInstance, AppManifest } from './type';
import { handleManifest } from './manifest';

const formatUrl = (url: string, manifest: string) => {
  return getRealUrl(url, manifest);
}

const getManifest = async (url: string) => {
  return await getFromCdn(url) as AppManifest;
}

const addStyles = (urls: string[], manifest: string) => {
  urls.forEach((url) => {
    const styleSheet = document.createElement('link');
    styleSheet.rel = 'stylesheet';
    styleSheet.href = formatUrl(url.replace('.css', '.os.css'), manifest);
    document.head.appendChild(styleSheet);
  });
}

/**
 * Load the app external from url
 * @param {AppInfo} appInfo
 * @param {VMContext} context
 */
export const loadExternal = async (appInfo: AppInfo, context: VMContext) => {
  return Promise.all(
    appInfo.externals.map((external) => {
      if (!external.url) {
        return Promise.resolve();
      }
      return loadBundle({
        id: external.id,
        url: external.url,
        context,
      });
    })
  )
}

export const extractApp = (app: any) =>  {
  return app.default ? app.default : app;
}

/**
 * Create an app loader for single spa
 * @param {AppInfo} appInfo App info for os
 * @param {VMContext} context BrowerVM Context
 */
export const createAppLoader = async (appInfo: AppInfo, context: VMContext) => {
  let { id, url } = appInfo;
  let style: string[] | null = null;

  if (appInfo.externals) {
    await loadExternal(appInfo, context);
  }

  if (appInfo.manifest) {
    const manifest = await getManifest(appInfo.manifest)
    if (manifest) {
      // TODO: validate the manifest
      id = manifest.name;

      const { js, css } = handleManifest(manifest);

      url = formatUrl(js[js.length - 1], appInfo.manifest);

      style = css;
    }
  }

  if (style) {
    addStyles(style, appInfo.manifest)
  }

  const appInstance = extractApp(
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