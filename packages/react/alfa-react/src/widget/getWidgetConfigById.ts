import template from 'lodash/template';
import { request } from '@alicloud/alfa-core';

import { WidgetFactoryOption, WidgetCWSConfig } from '../types';
import { ENV, getConsoleEnv } from './env';

const cachedConfig: Record<string, WidgetCWSConfig> = {};

export const getWidgetConfigById = async (option: WidgetFactoryOption) => {
  const env = ENV[option.env || getConsoleEnv()];

  if (!cachedConfig[option.name]) {
    const resp = await request.get<WidgetCWSConfig>(template(env.configUrl)({ id: option.name }));
    cachedConfig[option.name] = resp?.data;
  }

  return cachedConfig[option.name];
};
