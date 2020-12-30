import { Record } from './Record';
import { BundleResolver } from '../type';

export class Module {
  public static record: Map<string, Record> = new Map<string, Record>()
  /**
   * unique identity for module
   */
  public readonly id: string;

  /**
   * parent who load this module. it is main by default.
   * but when A bundle use loader to load B bundle, parent
   * of B is A;
   */
  public readonly parent: string;

  /**
   * export object of the module
   */
  public exports;

  public readonly filename: string;
  public readonly exited: boolean;

  public loaded: boolean;

  public context: any;
  public resolver: BundleResolver;
  private cache: Map<string, Module> = new Map<string, Module>();

  public constructor(id: string, parent: string) {
    this.id = id;
    this.exports = {};
    this.parent = parent;

    this.filename = id;
    this.loaded = false;
  }

  public resolved = (id: string) => {
    return this.cache.has(id);
  }

  public require = (id: string) => {
    const module = this.resolveModule(id);
    return this.context?.window[id] || module.exports;
  }

  public requireIsolateWithContext(id: string, context: any) {
    const module = this.resolveModule(id);
    module.resolver(module.require, module, module.exports, { ...context });
    return module.exports;
  }

  public resolveModule(id: string, parent: string = null) {
    const cachedModule = this.cache.get(id);
    if (cachedModule !== undefined) {
      return cachedModule;
    }

    const module = new Module(id, parent);
    this.cache.set(id, module);
    return module;
  }
}