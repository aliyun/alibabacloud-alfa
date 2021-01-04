import React from 'React';
import { createMicroApp, IOptions } from '@alicloud/alfa-core'

export interface AlfaVersion {
  entry: string;
}

type Version = string;

export interface AlfaReleaseConfig {
  versions: Record<Version, AlfaVersion>;
  'dist-tag': Record<string, string>;
}


export type EnvEnum = 'prod' | 'local' | 'pre' | 'daily';
export interface AlfaFactoryOption extends IOptions {
  name: string;
  version?: string;
  loading?: boolean | React.ReactChild;
  env?: EnvEnum;
  url?: string;
  manifest?: string;
  dependencies?: Record<string, any>;
}

type OmitKeys = 'manifest';
export interface WidgetFactoryOption extends Omit<AlfaFactoryOption, OmitKeys> {
  runtimeVersion?: string;
}

export interface AlfaEnvConfigDescriptor {
  releaseUrl: string;
  configUrl?: string;
  cdnBackupUrl?: string;
  resourceUrl?: string;
}

export interface AlfaEnvConfig {
  daily: AlfaEnvConfigDescriptor;
  local: AlfaEnvConfigDescriptor;
  pre: AlfaEnvConfigDescriptor;
  prod: AlfaEnvConfigDescriptor;
}

export interface WidgetReleaseConfig {
  [id: string]: {
    [version: string]: {
      latest: string;
    };
  };
}

export interface WidgetCWSConfig {
  conf: {
    [channel: string]: {
      [key: string]: string;
    };
  };
  features: {
    [channel: string]: {
      [key: string]: boolean;
    };
  };
  links: {
    [channel: string]: {
      [key: string]: string;
    };
  };
  locales: {
    [locale: string]: {
      messages: {
        [key: string]: string;
      }
    };
  };
}

export interface WidgetRuntime {
  react: any;
  reactDom: any;
  axios: any;
  'prop-types': any;
  '@ali/wind': any;
  '@ali/wind-utils-console': any;
  '@ali/wind-intl': any;
  '@ali/wind-intl/lib/Provider': any;
  '@ali/wind-intl/lib/withRcIntl': any;
  '@ali/widget-utils-console': any;
}

type ThenArg<T> = T extends PromiseLike<infer U> ? U : T;
export type MicroApplication = ThenArg<ReturnType<typeof createMicroApp>>;