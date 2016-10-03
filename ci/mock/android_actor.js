#!/usr/bin/env node

process.env.DEBUG = 'sg:*,hec:*'

const HUB_URL = process.env.HUB_URL || 'http://localhost:3000'

// README の Actor 規約参照
const ACTOR_KEY = process.env.ACTOR_KEY || 'qq:hitoe:01'

const co = require('co')
const asleep = require('asleep')
const sugoActor = require('sugo-actor')
const AndroidModule = require('./android_module')
const debug = require('debug')('hec:android_actor')

co(function * () {
  let android = new AndroidModule({
    lat: 35.700575,
    lng: 139.751983,
    name: 'Hitoe Android'
  })
  let actor = sugoActor(`${HUB_URL}/actors`, {
    key: ACTOR_KEY,
    modules: {
      android
    }
  })
  yield actor.connect()

  // 通報する Mock
  let infoList = [
    'やばい',
    '倒れる',
    '倒れました',
    '心臓が止まりそう',
    '心肺停止'
  ]
  let reports = (new Array(5)).fill({
    device_id: ACTOR_KEY,
    device_name: 'Android',
    report_id: 'report-01',
    lat: 35.700275,
    lng: 139.753314
    // date: Date.now()
  }).map((report, i) => Object.assign({}, report, {
    info: infoList[i],
    lng: report.lng + i * 0.0001 // 10mくらい
  }))
  for (let report of reports) {
    yield asleep(3000)
    report.date = new Date()
    debug('report', report)
    android.emit('report', report)
  }
}).catch((err) => console.error(err))
