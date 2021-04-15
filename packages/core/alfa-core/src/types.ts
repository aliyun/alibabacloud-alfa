import { OSApplication, SandBoxOption } from '@alicloud/console-os-kernal';

export interface IAppManifest {
  scripts: string[];
  styles?: string[];
}

export interface IAppConfig<T = any> {
  entry?: IAppManifest | string;
  name: string;
  container?: HTMLElement | null;
  props?: Record<string, T>;

  // alfa 的扩展属性
  manifest?: string;
  logger?: {
      debug: () => {};
      error: () => {};
      warn: () => {};
      info: () => {};
  };
  deps?: {
      [key: string]: any;
  };
}

export interface IOptions<T = any> {
  sandbox?: boolean | SandBoxOption;
  beforeMount?(app: OSApplication): void;
  afterMount?(app: OSApplication): void;
  beforeUnmount?(app: OSApplication): void;
  afterUnmount?(app: OSApplication): void;
  beforeUpdate?(app: OSApplication): void;
  afterUpdate?(app: OSApplication): void;
}

export interface AlfaVersion {
  entry: string;
}

type Version = string;

export interface AlfaReleaseConfig {
  versions: Record<Version, AlfaVersion>;
  'dist-tags': Record<string, string>;
}


type AlfaChannelLinks = Record<string, Record<string, string>>;
type AlfaChannelFeatures = Record<string, Record<string, any>>;

export interface AlfaDynamicConfig {
  ALL_CHANNEL_LINKS: AlfaChannelLinks;
  ALL_CHANNEL_FEATURE_STATUS: AlfaChannelFeatures;
}

export interface AlfaFactoryOption {
  name: string;
  version?: string;
  env?: 'prod' | 'local' | 'pre' | 'daily';
}

export interface AlfaEnvConfigDescriptor {
  releaseUrl: string;
  cdnBackupUrl: string;
  configUrl: string;
}

export interface AlfaEnvConfig {
  daily?: AlfaEnvConfigDescriptor;
  local?: AlfaEnvConfigDescriptor;
  pre?: AlfaEnvConfigDescriptor;
  prod?: AlfaEnvConfigDescriptor;
}
