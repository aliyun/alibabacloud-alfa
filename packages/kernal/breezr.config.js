module.exports = {
  presets: [
    ['@alicloud/console-toolkit-preset-wind-component', {
      moduleName: 'aliOSKernal',
      useTypescript: true,
      babelExclude: /node_modules\/(?!lrc-cache)\/.*/ig
    }]
  ]
}