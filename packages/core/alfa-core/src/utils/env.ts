import { EnvEnum, IWin } from '../types';

/**
 * get alfa env
 * @returns
 */
export const getEnv = (value?: EnvEnum): EnvEnum => {
  if (value) return value;

  if (process.env.NODE_ENV === 'development') {
    return 'local';
  }

  // default return prod
  return (window as IWin)?.ALIYUN_CONSOLE_CONFIG?.fEnv || 'prod';
};
