/**
 * Start a build server by webpack-dev-server.
 * @function devServer
 * @param {Object} options - Optional settings
 * @returns {Promise}
 */

const co = require('co')
const defaults = require('defaults')
const DevServer = require('webpack-dev-server')
const webpack = require('webpack')
const config = require('../webpack.config.dev')

/** @lends devServer */
function devServer (options = {}) {
  let { host, port } = defaults(options, {
    host: 'localhost',
    port: {
      SERVER: 3000,
      BUILD_SERVER: 3002
    }
  })

  return co(function * () {
    const compiler = webpack(config({
      host,
      port: port.BUILD_SERVER
    }))
    let server = new DevServer(compiler, {
      contentBase: `http://${host}/`,
      hot: true,
      historyApiFallback: false,
      compress: false,
      proxy: {
        '*': `http://${host}:${port.SERVER}`
      },
      staticOptions: {},

      // webpack-dev-middleware options
      quiet: false,
      noInfo: true,
      publicPath: '/',
      stats: { colors: true }
    })

    server.listen(port.BUILD_SERVER, host, function (err) {
      if (err) {
        console.error(err)
        return
      }
      console.log(`webpack-dev-server listening at http://${host}:${port.BUILD_SERVER}`)
    })
  })
}

module.exports = devServer
