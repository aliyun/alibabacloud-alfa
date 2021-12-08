class LocationProxy {
  constructor(location: Location) {
    return new Proxy(
      {},
      {
        set(target, name: keyof Location, value: string) {
          switch (name) {
            case 'href':
              break;
            default:
              // eslint-disable-next-line no-param-reassign
              location[name] = value;
          }
          return true;
        },
        get(target, name) {
          switch (name) {
            case 'reload':
              return () => {};
            case 'replace':
              return () => {};
            case 'toString':
              return () => {
                try {
                  return location.toString();
                } catch (e) {
                  return location.href;
                }
              };
            default:
              break;
          }

          const locProperty = location[name] as string | (() => void);
          if (typeof locProperty === 'function') {
            return locProperty.bind && locProperty.bind(target);
          }
          return locProperty;
        },
      }
    );
  }
}

export default LocationProxy;
