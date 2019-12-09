import { LifeCycles } from 'single-spa';

export type Lifecycle<T = any> = (app: AppInstance<T>) => Promise<any>;

interface ExtendsAppLifeCycles<T> {
  appWillLoad?: Lifecycle<T> | Lifecycle<T>[]; // function before app load
  appWillMount?: Lifecycle<T> | Lifecycle<T>[]; // function before app mount
  appDidMount?: Lifecycle<T> | Lifecycle<T>[]; // function after app mount
  appWillUnmount?: Lifecycle<T> | Lifecycle<T>[]; // function after app unmount
  appDidUnmount?: Lifecycle<T> | Lifecycle<T>[]; // function after app unmount
}

export interface AppInstance<T = any> extends LifeCycles<T> {
  id: string;
  name: string;
}

export interface BasicModule {
  id: string;
  url?: string;
}

export interface AppInfo<T = any> extends BasicModule, ExtendsAppLifeCycles<T> {
  version?: string;
  name?: string;
  dom?: Element;
  manifest?: string;
  externals?: BasicModule[];
  customProps?: {
    [key: string]: any;
  };
  deps?: {
    [key: string]: any;
  };
  activityFn: () => boolean;
}

export interface AppCreationOption<E> {
  runtime: string;
}

export interface SandBoxOption {
  disable?: boolean;
  sandBoxUrl?: string;
  singleton?: boolean;
  initialPath?: string;
  externalsVars?: string[];
}

export interface AppOption {
  sandBox?: SandBoxOption;
  parcel?: boolean;
  deps?: {
    [key: string]: any;
  };
}

export interface AppManifest {
  name: string;
  resources: {
    [key: string]: string;
  };
  entrypoints: {
    [id: string]: {
      js: string[];
      css: string[];
    };
  };
}