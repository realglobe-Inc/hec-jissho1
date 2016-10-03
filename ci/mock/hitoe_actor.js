#!/usr/bin/env node

process.env.DEBUG = 'sg:*,hec:*'

const HUB_URL = process.env.HUB_URL || 'http://localhost:3000'

// README の Actor 規約参照
const ACTOR_KEY = process.env.ACTOR_KEY || 'qq:hitoe:01'

const co = require('co')
const asleep = require('asleep')
const sugoActor = require('sugo-actor')
const HitoeModule = require('./android_module')
const debug = require('debug')('hec:android_actor')

co(function * () {
  let hitoe = new HitoeModule({})
  let actor = sugoActor(`${HUB_URL}/actors`, {
    key: ACTOR_KEY,
    modules: {
      hitoe
    }
  })
  yield actor.connect()

  // 通報する Mock
  let reports = (new Array(5)).fill({
    lat: 35.700275,
    lng: 139.753314,
    heartRate: 30
  })
  for (let report of reports) {
    yield asleep(3000)
    debug('emergency', report)
    hitoe.emit('emergency', report)
  }
}).catch((err) => console.error(err))
