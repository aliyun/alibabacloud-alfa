import { Record } from './Record';
import { BundleResolver } from '../type';

export class Module {
  private static _cache: Map<string, Module> = new Map<string, Module>();

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

  public constructor(id: string, parent: string) {
    this.id = id;
    this.exports = {};
    this.parent = parent;

    this.filename = id;
    this.loaded = false;
  }

  public resolved(id: string) {
    return Module._cache.has(id);
  }

  public require(id: string) {
    return Module._load(id);
  }

  public requireIsolateWithContext(id: string, context: any) {
    const module = Module.resolveModule(id);
    module.resolver(module.require, module, module.exports, { ...context });
    return module.exports;
  }

  public static resolveModule(id: string, parent: string = null) {
    const cachedModule = Module._cache.get(id);
    if (cachedModule !== undefined) {
      return cachedModule;
    }

    const module = new Module(id, parent);
    Module._cache.set(id, module);
    return module;
  }

  public static _load(id: string, parent: string = null) {
    const module = this.resolveModule(id, parent);
    module.loaded = true;
    return module.exports;
  }
  
}