
interface VMContext {
  window: Window;
  document: Document;
  history: History;
  location: Location;
  baseFrame?: HTMLFrameElement;
  updateBody?: (body: Element) => void;
}

interface ContextOption {
  body?: Element;
  externals?: string[];
  url?: string;
  id?: string;
  disableBody?: boolean;
}

interface BrowserVM {
  createContext: (opts: ContextOption) => Promise<VMContext>;
  removeContext: (VMContext) => void;
  ContextOption;
}

declare var browserVM: BrowserVM;

declare var contextOption: ContextOption;

declare module "@alicloud/console-os-browser-vm" {
  export = browserVM;
}
