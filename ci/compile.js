#!/usr/bin/env node

/**
 * Build the site.
 */
const webpack = require('webpack')
const config = require('../webpack.config.production.js')

process.chdir(`${__dirname}/..`)

compile({
  uglify: false,
  ci: process.env.CI || false,
  jsOnly: process.env.JS || false,
  cssOnly: process.env.CSS || false
})

function compile (options = {}) {
  let {uglify, ci, jsOnly, cssOnly} = options
  let conf = config({
    dir: process.cwd(),
    uglify,
    ci
  })
  if (jsOnly) {
    conf = conf[0]
  }
  if (cssOnly) {
    conf = conf[1]
  }
  let compiler = webpack(conf)
  compiler.run((err, stats) => {
    if (err) {
      console.error(err)
      return
    }
    console.log(stats.toString({
      chunks: false,
      colors: true
    }))
  })
}
