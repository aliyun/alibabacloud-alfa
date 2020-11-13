import { OSApplication, SandBoxOption } from '@alicloud/console-os-kernal';
import React from 'React';

export interface IAppManifest {
  scripts: string[];
  styles?: string[];
}

export interface IAppConfig<T = any> {
  entry?: IAppManifest | string;
  name: string;
  container?: HTMLElement;
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

export interface AlfaFactoryOption {
  name: string;
  version?: string;
  env?: 'prod' | 'local' | 'pre' | 'daily';
}

export interface AlfaEnvConfigDescriptor {
  releaseUrl: string;
  cdnBackupUrl: string;
}

export interface AlfaEnvConfig {
  daily?: AlfaEnvConfigDescriptor;
  local?: AlfaEnvConfigDescriptor;
  pre?: AlfaEnvConfigDescriptor;
  prod?: AlfaEnvConfigDescriptor;
}
