import { AxiosRequestConfig } from 'axios';
import instance from '../request';

export interface RequestInterceptor {
  (config: AxiosRequestConfig): AxiosRequestConfig | Promise<AxiosRequestConfig>;
}

const requestList: RequestInterceptor[] = [];

export const addRequestInterceptor = (fn: RequestInterceptor) => {
  const interceptor: RequestInterceptor = (config) => {
    try {
      const result = fn(config);
      return Promise.resolve(result).catch(() => config);
    } catch (e) {
      return config;
    }
  };

  instance.interceptors.request.use(interceptor, undefined);
};
