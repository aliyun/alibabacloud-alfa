export { createMicroApp } from './createMicroApp';
export { createIsomorphicMicroApp, renderToString } from './createIsomorphicMicroApp';
export { getManifest } from './resolveAlfaManifest';
export { getConfig } from './resolveAlfaConfig';
export { IAppConfig, IOptions, AlfaFactoryOption, AlfaDynamicConfig as AlfaConfig } from './types'
export { createEventBus, prefetch, IIsomorphicEnvironment } from '@alicloud/console-os-kernal';