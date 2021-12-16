import { LifeCycles } from 'single-spa';

export type Lifecycle<T = any> = (app: AppInstance<T>) => Promise<any>;

interface ExtendsAppLifeCycles<T> {
  appWillLoad?: Lifecycle<T> | Lifecycle<T>[]; // function before app load
  appWillMount?: Lifecycle<T> | Lifecycle<T>[]; // function before app mount
  appDidMount?: Lifecycle<T> | Lifecycle<T>[]; // function after app mount
  appWillUnmount?: Lifecycle<T> | Lifecycle<T>[]; // function after app unmount
  appDidUnmount?: Lifecycle<T> | Lifecycle<T>[]; // function after app unmount
  appWillUpdate?: Lifecycle<T> | Lifecycle<T>[]; // function after app unmount
}

export interface AppInstance<T = any> extends LifeCycles<T> {
  name: string;
}

export interface BasicModule {
  name?: string;
  url?: string;
  manifest?: string | AppManifest;
  deps?: {
    [key: string]: any;
  };
}

export interface AppInfo<T = any> extends BasicModule, ExtendsAppLifeCycles<T> {
  version?: string;
  dom?: Element;
  logger?: {
    debug: () => {};
    error: () => {};
    warn: () => {};
    info: () => {};
  };
  manifest?: string | AppManifest;
  externals?: BasicModule[];
  customProps?: {
    [key: string]: any;
  };
  publicPath?: string;
  sharingKernel?: boolean;
}

export interface AppCreationOption<E> {
  runtime: string;
}

export interface SandBoxOption {
  disable?: boolean;
  sandBoxUrl?: string;
  singleton?: boolean;
  initialPath?: string;
  syncInitHref?: boolean;
  externalsVars?: string[];
  allowEvents?: string[];
  disableFakeBody?: boolean;
  allowResources?: string[];
}

export interface AppOption {
  sandbox?: SandBoxOption;
  parcel?: boolean;
}

export interface GlobalOption extends AppOption {
  deps?: {
    [key: string]: any;
  };
}

export interface AppManifest {
  name: string;
  externals?: string[];
  resources: {
    [key: string]: string;
  };
  runtime?: BasicModule;
  entrypoints: {
    [id: string]: {
      js: string[];
      css: string[];
    };
  };
}

export interface IIsomorphicEnvironment {
  getJson: <T = any>(manifest: string) => T;

  fetchJsonResource: <T = any>(url: string) => Promise<T>;

  fetchBundle: <T = any>(manifest: string | AppManifest) => T;

  getBundle: <T = any>(manifest: string | AppManifest) => Promise<T>;
}