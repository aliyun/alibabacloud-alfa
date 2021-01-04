import template from 'lodash/template';
import { AlfaFactoryOption, WidgetCWSConfig } from '../types';
import axios from 'axios';
import { ENV, getConsoleEnv } from './env';

const cachedConfig: Record<string, WidgetCWSConfig> = {};

export const getWidgetConfigById = async (option: AlfaFactoryOption) => {
  const env = ENV[option.env || getConsoleEnv()];
  console.log(env.configUrl)
  if (!cachedConfig[option.name]) {
    const resp = await axios.get<WidgetCWSConfig>(template(env.configUrl)({id: option.name}),);
    cachedConfig[option.name] = resp.data;
  }

  return cachedConfig[option.name];
}
