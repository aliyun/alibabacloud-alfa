import md5 from 'crypto-js/md5';
import { getCookie } from '@alicloud/cookie';

import { IWin } from '../types';

/**
 * 获取主账号 uid
 * @returns
 */
export const getMainUid = () => {
  return (window as IWin).ALIYUN_CONSOLE_CONFIG?.MAIN_ACCOUNT_PK || getCookie('login_aliyunid_pk') || undefined;
};

/**
 * 获取 md5 后的主账号 uid
 * @param uid
 * @returns
 */
export const getMD5MainUid = () => {
  const uid = getMainUid();

  if (!uid) return undefined;

  return md5(uid).toString();
};
