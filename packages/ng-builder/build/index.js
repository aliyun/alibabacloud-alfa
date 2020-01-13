import { __spreadArrays } from "tslib";
import * as path from 'path';
import { mergeConfigs } from '@angular-builders/custom-webpack/dist/webpack-config-merger';
import WebpackChain from 'webpack-chain';
import webpackMerge from 'webpack-merge';
import { chainOsWebpack } from '@alicloud/console-toolkit-plugin-os';
var chain = new WebpackChain();
// remove plugin
function removePluginByName(plugins, name) {
    var pluginIndex = plugins.findIndex(function (plugin) { return plugin.constructor.name === name; });
    if (pluginIndex > -1) {
        plugins.splice(pluginIndex, 1);
    }
}
// remove css
function removeMiniCssExtract(config) {
    removePluginByName(config.plugins, 'MiniCssExtractPlugin');
    config.module.rules.forEach(function (rule) {
        if (rule.use) {
            var cssMiniExtractIndex = rule.use.findIndex(function (use) { return typeof use === 'string' && use.includes('mini-css-extract-plugin'); });
            if (cssMiniExtractIndex >= 0) {
                rule.use[cssMiniExtractIndex] = { loader: 'style-loader' };
            }
        }
    });
}
var osAngularWebpack = function (config) {
    var singleSpaConfig = {
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
    };
    var mergedConfig = webpackMerge.smart(config, singleSpaConfig);
    removePluginByName(mergedConfig.plugins, 'IndexHtmlWebpackPlugin');
    removeMiniCssExtract(mergedConfig);
    if (Array.isArray(mergedConfig.entry.styles)) {
        mergedConfig.entry.main = __spreadArrays(mergedConfig.entry.styles, mergedConfig.entry.main);
    }
    delete mergedConfig.entry['polyfills-es5'];
    delete mergedConfig.entry.polyfills;
    delete mergedConfig.entry.styles;
    delete mergedConfig.optimization.runtimeChunk;
    delete mergedConfig.optimization.splitChunks;
    return mergedConfig;
};
export default (function (userConfig) { return function (config, ngOptions) {
    var opts = {
        id: 'config-webpack'
    };
    chainOsWebpack(opts, { on: function () { } })(chain);
    return osAngularWebpack(mergeConfigs(mergeConfigs(config, userConfig, { 'module.rules': 'prepend' }, undefined), chain.toConfig(), { 'module.rules': 'prepend' }, undefined));
}; });
