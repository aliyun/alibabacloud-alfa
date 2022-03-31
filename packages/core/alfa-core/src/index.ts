export { createMicroApp } from './createMicroApp';
export { getRelease } from './utils/getRelease';
export { getManifest } from './utils/getManifest';
export { getConfig } from './utils/getConfig';
export { getI18nMessages } from './utils/getI18nMessages';
export { getLocale, getEnv } from './utils';
export { default as BaseLoader } from './base';
export { default as Logger } from './utils/logger';
export * from './utils/index';
export { createEventBus, prefetch } from '@alicloud/console-os-kernal';

export { IAppConfig, IOptions, AlfaFactoryOption, AlfaDynamicConfig as AlfaConfig, IWin, EnvEnum as AlfaEnvEnum, AlfaLogger } from './types';
