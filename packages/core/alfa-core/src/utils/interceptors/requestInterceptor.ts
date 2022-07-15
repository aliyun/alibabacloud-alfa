import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { handleRequestInterceptor } from './index';

export default async function requestInterceptor(config: AxiosRequestConfig) {
  try {
    return handleRequestInterceptor(config);
  } catch (e) {}

  return config;
}
