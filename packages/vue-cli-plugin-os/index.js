/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const { chainOsWebpack } = require('@alicloud/console-toolkit-plugin-os')
const { sandBoxCss } = require('@alicloud/console-toolkit-plugin-os/lib/sandboxCss')

const DonePlugin = require('./DonePlugins');

module.exports = (api, options) => {
  api.on = () => {}
  api.chainWebpack(webpackConfig => {
    webpackConfig
      .devServer
      .headers({
        'Access-Control-Allow-Origin': '*'
      })
      .set('disableHostCheck', true)
    webpackConfig.plugins.delete('prefetch')
    webpackConfig.plugins.delete('preload')
    webpackConfig.optimization.delete('splitChunks')
    chainOsWebpack(
      options.pluginOptions && options.pluginOptions.consoleOs || {},
      api
    )(webpackConfig)

    webpackConfig
      .plugin('DonePlugin')
      .use(DonePlugin, [{
        done(){
          const buildDestDir = process.env.BUILD_DEST_DIR || process.env.BUILD_DEST || 'dist';
          const dist = path.resolve(process.cwd(), buildDestDir, 'css')
          sandBoxCss(dist, 'rightcloud-costmgmt', {
            disableOsCssExtends: true,
          });
        }
      }])
  })
}