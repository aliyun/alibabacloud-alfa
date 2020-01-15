import * as path from 'path';
import { mergeConfigs } from '@angular-builders/custom-webpack/dist/webpack-config-merger';
import WebpackChain from 'webpack-chain';
import webpackMerge from 'webpack-merge';
import { chainOsWebpack } from '@alicloud/console-toolkit-plugin-os';

const chain = new WebpackChain();

// remove plugin
function removePluginByName(plugins, name) {
  const pluginIndex = plugins.findIndex(plugin => plugin.constructor.name === name);
  if (pluginIndex > -1) {
    plugins.splice(pluginIndex, 1);
  }
}

// remove css
function removeMiniCssExtract(config) {
  removePluginByName(config.plugins, 'MiniCssExtractPlugin');
  config.module.rules.forEach(rule => {
    if (rule.use) {
      const cssMiniExtractIndex = rule.use.findIndex(use => typeof use === 'string' && use.includes('mini-css-extract-plugin'));
      if (cssMiniExtractIndex >= 0) {
        rule.use[cssMiniExtractIndex] = {loader: 'style-loader'}
      }
    }
  });
}

const osAngularWebpack = (config) => {
  const singleSpaConfig = {
    output: {
      libraryTarget: 'umd',
    },
    externals: {
      'zone.js': 'Zone',
    },
    devServer: {
      historyApiFallback: false,
      contentBase: path.resolve(process.cwd(), 'src'),
      headers: {
        'Access-Control-Allow-Headers': '*',
      },
    },
  }

  const mergedConfig = webpackMerge.smart(config, singleSpaConfig)

  removePluginByName(mergedConfig.plugins, 'IndexHtmlWebpackPlugin');
  removeMiniCssExtract(mergedConfig);

  if (Array.isArray(mergedConfig.entry.styles)) {
    mergedConfig.entry.main = [...mergedConfig.entry.styles, ...mergedConfig.entry.main];
  }
  delete mergedConfig.entry['polyfills-es5'];
  delete mergedConfig.entry.polyfills;
  delete mergedConfig.entry.styles;
  delete mergedConfig.optimization.runtimeChunk;
  delete mergedConfig.optimization.splitChunks;

  return mergedConfig;
}

export default (userConfig = {}, options) => (config) => {
  const opts = {
    id: options.id
  };
  // @ts-ignore
  chainOsWebpack(opts)(chain)

  return osAngularWebpack(
    mergeConfigs(
      mergeConfigs(config, userConfig, { 'module.rules': 'prepend' }, undefined),
      chain.toConfig(),
      { 'module.rules': 'prepend' },
      undefined
    )
  );
}