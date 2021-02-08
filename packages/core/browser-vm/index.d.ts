
export interface VMContext {
  window: Window;
  document: Document;
  history: History;
  location: Location;
  baseFrame?: HTMLFrameElement;
  body?: HTMLBodyElement;
  loadScripts?: (url: string) => Promise<void>;
  updateBody?: (body: Element) => void;
}

export interface ContextOption {
  body?: Element;
  externals?: string[];
  url?: string;
  id?: string;
  disableBody?: boolean;
  allowResources?: string[];
}

export function removeContext(VMContext): void;

export function createContext(opts: ContextOption): Promise<VMContext>

export interface BrowserVM {
  createContext: (opts: ContextOption) => Promise<VMContext>;
  removeContext: (VMContext) => void;
  ContextOption;
}

export declare var browserVM: BrowserVM;

export declare var contextOption: ContextOption;

export declare module "@alicloud/console-os-browser-vm" {
  export = browserVM;
}
