/* eslint-disable */
const path = require('path');
const merge = require('webpack-merge');
const WepbackChain = require('webpack-chain');
const { chainOsWebpack } = require('@alicloud/console-toolkit-plugin-os');

const chain = new WepbackChain();

chainOsWebpack({
  id: 'index',
})(chain);


const conf = merge(chain.toConfig(), {
  entry: './index.js',
  output: {
    filename: '[name].js',
    path: path.join(__dirname, 'dist'),
  },
  context: path.resolve('./src'),
  module: {
    rules: [
        {
            test: /\.js?$/,
            loaders: "babel-loader",
        }
      ]
  },
})

module.exports = conf;