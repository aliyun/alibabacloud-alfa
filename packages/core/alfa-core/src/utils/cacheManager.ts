import axios from 'axios';

class Cache {
  static create() {
    return new this();
  }

  store: Record<string, unknown>;

  constructor() {
    this.store = {};
  }

  async getRemote<T = any>(url: string) {
    if (this.store[url]) return this.store[url] as T;

    const res = await axios.get<T>(url);
    const result = res.data;

    if (result) this.store[url] = result;

    return result;
  }

  get<V = any>(key: string) {
    return this.store[key] as V;
  }

  set<V = any>(key: string, value: V) {
    this.store[key] = value;
  }

  clear() {
    this.store = {};
  }
}

export default Cache.create();
