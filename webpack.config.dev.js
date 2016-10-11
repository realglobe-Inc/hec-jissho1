'use strict'

const path = require('path')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const autoprefixer = require('autoprefixer')

const entries = [
  'index',
  'system',
  'reports'
]

function config (options = {}) {
  let { host, port } = options
  return [ {
    // TODO index.jsx を entries/ に移動してrename
    entry: entries.reduce((obj, name) => {
      return Object.assign(obj, {
        [name]: [
          `webpack-dev-server/client?http://${host}:${port}/`,
          'webpack/hot/dev-server',
          'babel-polyfill',
          `./ui/js/entries/${name}`
        ]
      })
    }, {}),
    output: {
      path: path.join(__dirname, 'public/js'),
      filename: '[name].bundle.js',
      publicPath: '/js/'
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('development')
      }),
      new webpack.HotModuleReplacementPlugin()
    ],
    devtool: 'cheap-module-eval-source-map',
    module: {
      loaders: [
        {
          test: /\.js$|\.jsx$/,
          loader: 'babel',
          exclude: /node_modules\/(?!sugo-cloud)(?!sugo-caller)(?!sg-schemas)/,
          include: __dirname,
          query: {
            presets: [ 'es2015', 'react', 'react-hmre' ],
            babelrc: false,
            compact: false,
            sourceRoot: __dirname
          }
        },
        {
          test: /\.json$/,
          loader: 'json-loader'
        }
      ]
    },
    resolve: {
      extensions: [ '', '.js', '.jsx', '.json' ]
    }
  }, {
    entry: entries.reduce((obj, name) => {
      return Object.assign(obj, {
        [name]: `./ui/scss/${name}.scss`
      })
    }, {}),
    output: {
      path: path.join(__dirname, 'public/css'),
      filename: '[name].css',
      publicPath: '/css/'
    },
    module: {
      loaders: [
        {
          test: /\.scss$/,
          loader: ExtractTextPlugin.extract('style-loader', [ 'css-loader', 'postcss-loader', 'sass-loader' ])
        }
      ]
    },
    postcss () {
      return [ autoprefixer ]
    },
    plugins: [
      new ExtractTextPlugin('[name].css')
    ]
  } ]
}

module.exports = config
