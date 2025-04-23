import axios from 'axios';
import qs from 'qs';
import parseEnv from '@alicloud/console-base-conf-parse-env';

import cache from './cacheManager';

const { FECS_HOST } = parseEnv();

type ENV = string;

const callCustomApi = async <T = any>(action: string, params: any, env: ENV) => {
  const key = JSON.stringify({ action, params, env });
  if (cache.get<T>(key)) return cache.get<T>(key);

  const res = await axios.request<{ code: string; message: string; data: T }>(
    {
      method: 'post',
      url: `//${FECS_HOST}/data/publicCustom.json`,
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      data: qs.stringify({
        product: 'one-console-custom-alfa',
        action,
        params: JSON.stringify({
          ...params,
          env: env === 'pre' ? 'daily' : env,
        }),
      }),
    },
  );

  if (+res.data.code !== 200) throw new Error(res.data.message);

  cache.set<T>(key, res.data.data);

  return res.data.data;
};

export const getMicroAppRelease = async <T>(name: string, env: ENV) => {
  return callCustomApi<T>('GetMicroAppRelease', { MicroAppPackageName: name }, env);
};

export const getMicroAppConfig = async <T>(CategoryName: string, ProductCode: string, env: ENV) => {
  return callCustomApi<T>('GetMicroAppConfig', { CategoryName, ProductCode }, env);
};

export const getMicroAppLocale = async <T>(name: string, version: string, locale: string, env: ENV) => {
  return callCustomApi<T>('GetMicroAppLocale', { MicroAppPackageName: name, version, locale }, env);
};
