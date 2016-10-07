#!/usr/bin/env node
const co = require('co')
const URL = require('url')
const HitoeObserver = require('../lib/observer')

const HUB_URL = process.env.HUB_URL || 'http://localhost:3000'

function observe () {
  return co(function * () {
    let observer = new HitoeObserver({
      protocol: URL.parse(HUB_URL).protocol,
      host: URL.parse(HUB_URL).host
    })
    yield observer.observe()
  })
}

module.exports = observe

if (!module.parent) {
  observe()
}
