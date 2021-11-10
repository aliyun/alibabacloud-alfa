import { OSApplication, SandBoxOption } from '@alicloud/console-os-kernal';

type Channel = string;

type ChannelLinks = Partial<Record<string, string>>;

type ChannelFeatures = Partial<Record<string, {
  status: boolean;
  attribute: {
    customAttrs: Record<string, unknown>;
    regions: {
      region: string[];
    };
  };
}>>;

type FeatureStatus = Partial<Record<string, string>>;

export interface IWin {
  ALIYUN_CONSOLE_I18N_MESSAGE?: Record<string, string>;
  ALIYUN_CONSOLE_CONFIG?: {
    fEnv: string;
    LOCALE: string;
    CHANNEL: string;
    CHANNEL_LINKS: ChannelLinks;
    CHANNEL_FEATURE_STATUS: ChannelFeatures;
    FEATURE_STATUS: FeatureStatus;
    SEC_TOKEN: string;
    portalType: string;
    MAIN_ACCOUNT_PK: string;
    CURRENT_PK: string;
  };
}

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

export interface IOptions {
  sandbox?: boolean | SandBoxOption;
  beforeMount?: (app: OSApplication) => void;
  afterMount?: (app: OSApplication) => void;
  beforeUnmount?: (app: OSApplication) => void;
  afterUnmount?: (app: OSApplication) => void;
  beforeUpdate?: (app: OSApplication) => void;
  afterUpdate?: (app: OSApplication) => void;
}

export interface AlfaVersion {
  entry: string;
}

export type LOCALE = 'en_US' | 'zh_CN' | 'zh_TW' | 'zh_HK' | 'ja_JP';

export type AlfaLocaleVersion = {
  [key in LOCALE | 'entry']: string;
};

type Version = string;

export interface AlfaReleaseConfig {
  'dist-tags': Record<string, string>;
  versions: Record<Version, AlfaVersion>;
  'locales-versions': Record<Version, AlfaLocaleVersion>;
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
  ALL_CHANNEL_LINKS: AlfaChannelLinks;
  ALL_CHANNEL_FEATURE_STATUS: AlfaChannelFeatures;
  ALL_FEATURE_STATUS: AlfaFeatures;
}

export type EnvEnum = 'prod' | 'local' | 'pre' | 'daily';

export interface AlfaFactoryOption extends IOptions {
  name: string;
  version?: string;
  env?: EnvEnum;
  loading?: boolean | React.ReactChild;
  url?: string;
  manifest?: string;
  dependencies?: Record<string, any>;
  dynamicConfig?: boolean;
}
