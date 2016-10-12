#!/usr/bin/env node

process.env.DEBUG = 'sg:*,hec:*'

const HUB_URL = process.env.HUB_URL || 'http://localhost:3000'

// README の Actor 規約参照
const ACTOR_KEY = process.env.ACTOR_KEY || 'qq:hitoe:01'

const co = require('co')
const asleep = require('asleep')
const sugoActor = require('sugo-actor')
const HitoeModule = require('./hitoe_module')
const debug = require('debug')('hec:android_actor')

let actor

// 終了時に disconnect する
// Observer に切断を知らせるため
process.on('SIGINT', () => co(function * () {
  try {
    yield actor.disconnect()
  } catch (e) {
    console.error(e)
  }
  process.exit()
}))

co(function * () {
  let hitoe = new HitoeModule()
  actor = sugoActor(`${HUB_URL}/actors`, {
    key: ACTOR_KEY,
    modules: { hitoe }
  })
  yield actor.connect()

  // 通報する Mock
  let id = Math.floor(Math.random() * 1000000)
  debug('Hitoe report id: ', id)
  let reports = (new Array(5)).fill(1).map((v, i) => ({
    id,
    location: [35.700275 + i * 0.0001, 139.753314, 10.22], // lat, lng, height
    heartRate: 30
  }))
  for (let report of reports) {
    yield asleep(3000)
    report.date = (new Date()).toISOString()
    hitoe.emitEmergency(report)
  }
}).catch((err) => console.error(err))
