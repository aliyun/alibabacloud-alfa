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
  async getRemote<T = any>(url?: string): Promise<AxiosResponse<T>> {
    if (!url) throw new Error('url is empty');

    const value = this.store[url] as Promise<AxiosResponse<T>> | undefined;
    if (value) {
      if (isPromiseLike(value)) {
        const result = await value;
        return result;
      }
      return value;
    }

    this.store[url] = request.get<T>(url);

    const result = await this.store[url];

    if (result?.data) this.store[url] = result;

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
