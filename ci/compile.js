#!/usr/bin/env node

/**
 * Build the site.
 */
const webpack = require('webpack')
const config = require('../webpack.config.production.js')

process.chdir(`${__dirname}/..`)

compile({
  uglify: false,
  ci: process.env.CI || false
})

function compile (options = {}) {
  let {uglify, ci} = options
  let compiler = webpack(config({
    dir: process.cwd(),
    uglify,
    ci
  }))
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
