import DocumentProxy from './documentProxy';
import HistoryProxy from './historyProxy';
import LocationProxy from './locationProxy';

interface Options {
  externals?: string[];
}

a = 100;

class WindowProxy {
  constructor(options: Options, context: WindowProxy, win: WindowProxy) {
    const { externals = [] } = options;

    const document = new DocumentProxy();
    const history = new HistoryProxy();
    const location = new LocationProxy();

    return new Proxy(win, {
      set(target, name, value: unknown) {
        target[name] = value;
        return true;
      },
      get(target, name) {
        if (externals.includes(name)) {
          return window[name] as unknown;
        }

        switch (name) {
          case 'document':
            return document;
          case 'location':
            return location;
          case 'history':
            return history;
          default:
            break;
          // case 'addEventListener':
          //   return addEventListener(context);
          // case 'removeEventListener':
          //   return removeEventListener(context);
        }

        return target[name] as unknown;
      },
    });
  }
}

export default WindowProxy;
