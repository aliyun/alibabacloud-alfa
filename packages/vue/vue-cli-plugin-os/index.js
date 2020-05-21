/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const { chainOsWebpack } = require('@alicloud/console-toolkit-plugin-os')

module.exports = (api, options) => {
  api.chainWebpack(webpackConfig => {
    webpackConfig
      .devServer
      .headers({
        'Access-Control-Allow-Origin': '*'
      })
      .set('disableHostCheck', true);

    webpackConfig.plugins.delete('prefetch');
    webpackConfig.plugins.delete('preload');
    webpackConfig.optimization.delete('splitChunks');

    const buildDestDir = process.env.BUILD_DEST_DIR || process.env.BUILD_DEST || 'dist';
    const dist = path.resolve(process.cwd(), buildDestDir, 'css');

    chainOsWebpack(
      {
        disableOsCssExtends: true,
        cssBuildDir: dist,
        ...(options.pluginOptions && options.pluginOptions.consoleOs || {}),
      },
      api
    )(webpackConfig);
  })
}