export { createMicroApp } from './createMicroApp';
export { getRelease } from './utils/getAlfaRelease';
export { getManifest } from './utils/getAlfaManifest';
export { getConfig } from './utils/getAlfaConfig';
export { getLocale } from './utils/getAlfaLocale';
export { default as BaseLoader } from './base';
export { default as Logger } from './utils/logger';
export * from './utils/index';
export { createEventBus, prefetch } from '@alicloud/console-os-kernal';

export { IAppConfig, IOptions, AlfaFactoryOption, AlfaDynamicConfig as AlfaConfig, IWin, EnvEnum as AlfaEnvEnum, AlfaLogger } from './types';
