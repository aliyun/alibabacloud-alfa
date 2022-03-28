import { AxiosResponse } from 'axios';

import request from './request';

const isPromiseLike = (value: any) => typeof value?.then === 'function';

class Cache {
  static create() {
    return new this();
  }

  store: Record<string, any>;

  constructor() {
    this.store = {};
  }

  /**
   * get remote json file
   * @param url
   * @returns
   */
  async getRemote<T = any>(url?: string): Promise<T> {
    if (!url) throw new Error('url is empty');

    const value = this.store[url] as Promise<AxiosResponse> | any;
    if (value) {
      if (isPromiseLike(value)) {
        const { data } = await value;
        return data;
      }
      return value as T;
    }

    this.store[url] = request.get<T>(url);

    const { data } = await request.get<T>(url);
    const result = data;

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
