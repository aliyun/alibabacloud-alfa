/* eslint-disable @typescript-eslint/no-var-requires */
const merge = require('webapck-merge');
const serveStatic = require('serve-static');
const path = require('path')

module.exports = (config) => {
  return merge(config, {
    devServer: {
      setup(app) {
        app.use(serveStatic(path.resolve(__dirname, 'test/fixtures')))
      }
    }
  })
}