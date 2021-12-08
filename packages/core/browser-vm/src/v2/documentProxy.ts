interface Options {}

class DocumentProxy {
  constructor(options: Options, context) {
    return new Proxy(document, {
      set(target, name, value) {
        switch(name) {
          case 'cookie':
            document.cookie = value;
            break;
          default:
            target[name] = value;
        }
      },

      get() {

      },
    });
  }
}

export default DocumentProxy;
