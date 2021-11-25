import react from 'react';
import reactDom from 'react-dom';
import axios from 'axios';
import kebabCase from 'lodash/kebabCase';
import * as propTypes from 'prop-types';
import { loadBundle } from '@alicloud/console-os-loader';
import { createAlfaWidget } from '../widget';
import { WidgetCWSConfig, WidgetRuntime, WidgetFactoryOption } from '../types';
import { getWidgetVersionById } from './getWidgetVersionById';
// @ts-ignore
import * as widgetUtils from '@alicloud/widget-utils-console';

const cachedRuntime: any = {};
let cachedMessage: any = null;

const WIDGET_RUNTIME_ID = '@ali/widget-wind-runtime';
const WIDGET_WIND_MESSAGE_ID = '@ali/wind-messages';
const WIDGET_UTILS_PKG_NAME = '@ali/widget-utils-console';

const createDynamicWindStylePrefix = (windRuntimeVersion: string) => {
  return 'v'.concat(windRuntimeVersion.split('.').join('-'), '-');
};


const createWidget = (option: any) => {
  return ({ id, version }: {id: string; version: string}) => createAlfaWidget({
    name: id,
    version,
    dependencies: option?.dependencies,
    runtimeVersion: option?.windRuntime?.runtimeVersion,
  });
};

export const getWidgetDeps = async (config: WidgetCWSConfig, option?: WidgetFactoryOption): Promise<WidgetRuntime> => {
  const { entryUrl, version } = await getWidgetVersionById({
    name: WIDGET_RUNTIME_ID,
    version: option?.runtimeVersion || '1.x',
  });

  const { version: messageVersion } = await getWidgetVersionById({
    name: WIDGET_WIND_MESSAGE_ID,
    version: '0.x',
  });

  if (!cachedMessage) {
    try {
      const resp = await axios.get(`https://g.alicdn.com/one-mcms/wind-v2/${messageVersion}/wind-v2_${(widgetUtils.getLocale() || 'en-US').toLowerCase()}.json`);
      cachedMessage = resp.data;
    } catch (e) { /* nothing */ }
  }


  const { version: oldVersion } = await getWidgetVersionById({
    name: WIDGET_RUNTIME_ID,
    version: '1.x',
  });

  if (!cachedRuntime[version]) {
    cachedRuntime[version] = await loadBundle<WidgetRuntime>({
      id: WIDGET_RUNTIME_ID,
      url: entryUrl,
      deps: {
        react,
        'react-dom': reactDom,
        'prop-types': propTypes,
      },
      xmlrequest: true,
      transform: (source: string) => {
        if (oldVersion !== version) {
          return source.replace(/aliyun-widget-/g, createDynamicWindStylePrefix(version));
        }
        return source;
      },
      context: { window, location, history, document },
    }) as WidgetRuntime;

    const components = cachedRuntime[version].default['@ali/wind'];

    Object.keys(components).forEach((key) => {
      cachedRuntime[version].default[`@ali/wind/lib/${kebabCase(key).toLowerCase()}`] = components[key];
    });
  }

  const injectedWidgetUtils = {
    ...widgetUtils,
    getChannelLink: widgetUtils.channelLinkFactory(() => config.links[widgetUtils.getChannel() || 'OFFICIAL']),
    getChannelFeature: widgetUtils.channelFeatureFactory(() => (config.features[widgetUtils.getChannel() || 'OFFICIAL'])),
    getLocale: () => (widgetUtils.getLocale() || 'en-US'),
    getWidgetI18nMessages: () => ({
      ...cachedMessage,
      ...(((config.locales || {})[widgetUtils.getLocale() || 'en-US'] || {}).messages || {}),
    }),
    getStylePrefixForWindComponent: () => {
      return oldVersion === version ? 'aliyun-widget-' : createDynamicWindStylePrefix(version);
    },
  };

  return {
    react,
    'react-dom': reactDom,
    'prop-types': propTypes,
    axios,
    ...cachedRuntime[version].default,
    [WIDGET_UTILS_PKG_NAME]: injectedWidgetUtils,
    // widget 1.x API 的兼容
    '@ali/widget-utils-config': injectedWidgetUtils,
    '@ali/widget-loader': createWidget,
  } as WidgetRuntime;
};
