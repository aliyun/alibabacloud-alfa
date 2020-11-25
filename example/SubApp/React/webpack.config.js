const merge = require('webpack-merge');
const WepbackChain = require('webpack-chain');
const { chainOsWebpack } = require('@alicloud/console-toolkit-plugin-os');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const chain = new WepbackChain();
chainOsWebpack({
  id: 'os-example',
  ignoreJsonpWrapFiles: [
    'common.js'
  ]
})(chain);

const regCommon = new RegExp(`[\\/]node_modules[\\/](_)?(${['react'].join('|')})[\\/|@]`);

module.exports = merge(chain.toConfig(), {
  entry: {
    'os-example': './src/index.js',
    // 'os-example2': './src/index2.js'
  },
  devtool: 'source-map',
  devServer: {
    port: '8081',
    clientLogLevel: 'warning',
    disableHostCheck: true,
    compress: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    overlay: { warnings: false, errors: true },
  },
  mode: 'development',
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: ['@babel/plugin-transform-react-jsx'],
          },
        },
      },
      {
        test: /\.less$/,
        use: ['style-loader', 'css-loader', 'less-loader'],
      },
    ],
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          test: regCommon,
          name: 'common',
          chunks: 'all'
        }
      }
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './public/index.html',
    }),
  ],
});
