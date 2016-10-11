'use strict'

const path = require('path')
const webpack = require('webpack')
const devConfig = require('./webpack.config.dev')

const entries = [
  'index',
  'system',
  'reports'
]

function config (options) {
  let { uglify, ci } = options
  return [ {
    entry: entries.reduce((obj, name) => {
      return Object.assign(obj, {
        [name]: [
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
        'process.env.NODE_ENV': ci ? JSON.stringify('test') : JSON.stringify('production')
      }),
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.OccurenceOrderPlugin()
    ].concat(uglify ? new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }) : []),
    module: {
      loaders: [
        {
          test: /\.js$|\.jsx$/,
          loader: 'babel',
          include: __dirname,
          query: {
            presets: [ 'es2015', 'react' ],
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
  },
    // css
    devConfig()[ 1 ]
  ]
}

module.exports = config
