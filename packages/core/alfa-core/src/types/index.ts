import { OSApplication, SandBoxOption, AppInfo } from '@alicloud/console-os-kernal';

export class AlfaLogger<P = any> {
  setContext?: (params: P) => void;
  record?: (params: P) => void;
  send?: () => void;
  info?: (params: P) => void;
  error?: (params: P) => void;
  warn?: (params: P) => void;
  debug?: (params: P) => void;
}

type Channel = string;

type ChannelLinks = Partial<Record<string, string>>;

type ChannelFeatures = Partial<Record<string, {
  status: boolean;
  attribute: {
    customAttrs: Record<string, unknown>;
    regions: string[] | {
      region: string[];
    };
  };
}>>;

type FeatureStatus = Partial<Record<string, boolean>>;

export interface IWin {
  ALIYUN_CONSOLE_I18N_MESSAGE?: Record<string, string>;
  ALIYUN_CONSOLE_GLOBAL?: Record<string, any>;
  ALIYUN_CONSOLE_CONFIG?: Partial<{
    fEnv: EnvEnum;
    LOCALE: string;
    CHANNEL: string;
    CHANNEL_LINKS: ChannelLinks;
    CHANNEL_FEATURE_STATUS: ChannelFeatures;
    FEATURE_STATUS: FeatureStatus;
    SEC_TOKEN: string;
    portalType: string;
    MAIN_ACCOUNT_PK: string;
    CURRENT_PK: string;
  }>;
}

export interface IAppManifest {
  scripts: string[];
  styles?: string[];
}

export interface IAppConfig<P = any> extends IOptions {
  entry?: IAppManifest | string;
  name: string;
  version?: string;
  container?: HTMLElement;
  props?: P;

  // alfa 的扩展属性
  manifest?: AppInfo['manifest'];
  url?: string;
  logger?: AlfaLogger;
  deps?: {
    [key: string]: any;
  };
  app?: OSApplication;
  env?: EnvEnum;
  locale?: string;
}

export interface IOptions {
  sandbox?: SandBoxOption;
  beforeMount?: AppInfo['appWillMount'];
  afterMount?: AppInfo['appDidMount'];
  beforeUnmount?: AppInfo['appWillUnmount'];
  afterUnmount?: AppInfo['appDidUnmount'];
  beforeUpdate?: AppInfo['appWillUpdate'];
  afterUpdate?: AppInfo['appWillUpdate'];
}

export interface AlfaVersion {
  entry: string;
}

export type LOCALE = 'en_US' | 'zh_CN' | 'zh_TW' | 'zh_HK' | 'ja_JP';

export type AlfaLocaleVersion = Partial<Record<string, string>>;

export type Version = string;

export interface AlfaConfigVersion {
  [key: string]: string;
}

export interface AlfaReleaseConfig {
  'dist-tags'?: Partial<Record<string, string>>;
  versions?: Record<Version, Partial<AlfaVersion>>;
  'locales-versions'?: Record<Version, Partial<AlfaLocaleVersion>>;
  'config-versions'?: Record<Version, Partial<AlfaConfigVersion>>;
}

type AlfaChannelLinks = Partial<Record<Channel, ChannelLinks>>;

type AlfaChannelFeatures = Partial<Record<Channel, ChannelFeatures>>;

interface AlfaFeature {
  enableSampling: boolean;
  enableWhiteList: boolean;
  enableBlockList: boolean;
  sampling: number;
  whiteList: string[];
  blockList: string[];
}

type AlfaFeatures = Partial<Record<string, AlfaFeature>>;

export interface AlfaDynamicConfig {
  ALL_CHANNEL_LINKS?: AlfaChannelLinks;
  ALL_CHANNEL_FEATURE_STATUS?: AlfaChannelFeatures;
  ALL_FEATURE_STATUS?: AlfaFeatures;
  GLOBAL_DATA?: Record<string, any>;
}

export type EnvEnum = 'prod' | 'local' | 'pre' | 'daily';

/**
   * @deprecated
   */
export interface AlfaFactoryOption extends IAppConfig {
  name: string;
  version?: string;
  env?: EnvEnum;
  loading?: boolean | React.ReactChild;
  url?: string;
  manifest?: string;
  dependencies?: Record<string, any>;
}
