/* eslint-disable @typescript-eslint/no-var-requires */
const { chainOsWebpack } = require('@alicloud/console-toolkit-plugin-os')

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
  })
}