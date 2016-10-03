#!/usr/bin/env node

/**
 * Build the site.
 */

process.chdir(`${__dirname}/..`)

const { compile } = require('sugo-ci-site')

compile({
  uglify: false,
  ci: process.env.CI || false
})
