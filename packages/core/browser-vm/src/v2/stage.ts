export default class Stage {
  constructor() {
    return new Proxy<Record<string, unknown>>(
      {},
      {
        set(target, key, value: unknown) {
          target[key] = value;
        },
        get(target, key) {
          return target[key];
        },
      }
    );
  }
}
