import template from 'lodash/template';
import { AlfaFactoryOption, WidgetCWSConfig } from '../types';
import axios from 'axios';

const cachedConfig: Record<string, WidgetCWSConfig> = {};

const WIDGET_CONFIG_URL = 'https://cws.alicdn.com/Release/pkgs/${id}/config.json';

export const getWidgetConfigById = async (option: AlfaFactoryOption) => {
  if (!cachedConfig[option.name]) {
    const resp = await axios.get<WidgetCWSConfig>(template(WIDGET_CONFIG_URL)({id: option.name}),);
    cachedConfig[option.name] = resp.data;
  }

  return cachedConfig[option.name];
}
