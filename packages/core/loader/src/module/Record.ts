export class Record<T = any> {
  public resolve: (value?: T | PromiseLike<T>) => void
  public reject: (reason?: any) => void
  public promise: Promise<T>;
  public loaded: boolean;
  public deps: {
    [key: string]: any;
  };
  public context: any
}