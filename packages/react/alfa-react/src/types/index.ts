import React from 'React';
import { createMicroApp, IAppConfig } from '@alicloud/alfa-core';

export interface AlfaVersion {
  entry: string;
}

type Version = string;

export interface AlfaReleaseConfig {
  versions: Record<Version, AlfaVersion>;
  'dist-tag': Record<string, string>;
}


export type EnvEnum = 'prod' | 'local' | 'pre' | 'daily';
export interface AlfaFactoryOption extends IAppConfig {
  // name: string;
  // version?: string;
  // env?: EnvEnum;
  // url?: string;
  // manifest?: string;
  // deps?: Record<string, any>;
  loading?: boolean | React.ReactChild;
  dependencies?: Record<string, any>;
  // style for container root
  className?: string;
  style?: Record<string, any>;
  unstable_runtime?: {
    css?: Record<string, string>;
    js?: Record<string, string>;
  };
  /**
   * 关闭缓存模式
   */
  noCache?: boolean;
  /**
   * 开启业务配置加载
   */
  dynamicConfig?: boolean;
  // used in cwsWidget
  runtimeVersion?: string;
  // render when throw error
  fallbackRender?: (error: Error) => Element;
}

type OmitKeys = 'manifest';
export interface WidgetFactoryOption extends Omit<AlfaFactoryOption, OmitKeys> {
  runtimeVersion?: string;
  alfaLoader?: boolean;

  // 加载 XConsole 样式
  theme?: string;

  // 加载中心化 release 文件
  central?: boolean;

  host?: string;

  configHost?: string;
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
      };
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
