import react from 'react';
import reactDom from 'react-dom';
import axios from 'axios';
import kebabCase from 'lodash/kebabCase'
import * as propTypes from 'prop-types';
import { loadBundle } from '@alicloud/console-os-loader'
import { WidgetCWSConfig, WidgetRuntime } from '../types';
import { getWidgetVersionById } from './getWidgetVersionById';
// @ts-ignore
import * as widgetUtils from '@alicloud/widget-utils-console'

let cachedRuntime: any = null;

const WIDGET_RUNTIME_ID = '@ali/widget-wind-runtime';
const WIDGET_UTILS_PKG_NAME = '@ali/widget-utils-console';

export const getWidgetDeps = async (config: WidgetCWSConfig): Promise<WidgetRuntime> => {
  const { entryUrl } = await getWidgetVersionById({
    name: WIDGET_RUNTIME_ID,
    version: '1.x'
  });
  
  if (!cachedRuntime) {
    cachedRuntime = await loadBundle<WidgetRuntime>({
      id: WIDGET_RUNTIME_ID,
      url: entryUrl,
      deps: {
        react: react,
        'react-dom': reactDom,
        'prop-types': propTypes
      },
      xmlrequest: true,
      context:{
        window,
        location,
        history,
        document
      }
    }) as WidgetRuntime;

    const components = cachedRuntime.default['@ali/wind'];
    Object.keys(components).forEach((key) => {
      cachedRuntime.default[`@ali/wind/lib/${kebabCase(key).toLowerCase()}`] = components[key];
    })
  }
  const injectedWidgetUtils = {
    ...widgetUtils,
    getChannelLink: widgetUtils.channelLinkFactory(() => config.links[widgetUtils.getChannel() || 'OFFICIAL']),
    getChannelFeature: widgetUtils.channelFeatureFactory(() => (config.features[widgetUtils.getChannel() || 'OFFICIAL'])),
    getLocale: () => (widgetUtils.getLocale()  || 'zh-CN'),
    getWidgetI18nMessages: () => ((config.locales[widgetUtils.getLocale() || 'zh-CN'] || {}).messages || {})
  };

  return {
    react: react,
    'react-dom': reactDom,
    'prop-types': propTypes,
    'axios': axios,
    ...cachedRuntime.default,
    [WIDGET_UTILS_PKG_NAME]: injectedWidgetUtils,
    // widget 1.x API 的兼容
    '@ali/widget-utils-config': injectedWidgetUtils
  } as WidgetRuntime
}