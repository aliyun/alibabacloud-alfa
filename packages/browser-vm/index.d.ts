
interface VMContext {
  window: Window;
  document: Document;
  history: History;
  location: Location;
  baseFrame?: HTMLFrameElement;
  updateBody?: (body: Element) => void;
}

interface ContextOption {
  initURL: string;
  body?: Element;
  externals?: string[];
  url?: string;
  id?: string;
}

interface BrowserVM {
  createContext: (opts: ContextOption) => Promise<VMContext>;
  removeContext: (VMContext) => void;
}

declare var browserVM: BrowserVM;

declare module "@alicloud/console-os-browser-vm" {
  export = browserVM;
}
