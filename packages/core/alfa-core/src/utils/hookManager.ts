export interface ChainPromise<T> {
  (conf: T): Promise<T>;
}

export interface HookHandler<T> { fulfilled?: ChainPromise<T>; rejected?: ChainPromise<T> }

export default class Hook<T> {
  handlers: Array<HookHandler<T>>;

  constructor() {
    this.handlers = [];
  }

  use(
    fulfilled: ChainPromise<T> | undefined,
    rejected: ChainPromise<T> | undefined = undefined,
  ): () => void {
    const handler: HookHandler<T> = {
      fulfilled,
      rejected,
    };

    this.handlers.push(handler);

    return () => {
      this.handlers = this.handlers.filter((h) => h !== handler);
    };
  }
}
