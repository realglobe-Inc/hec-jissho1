#!/usr/bin/env node
/**
 * hitoe actor の接続を監視する。
 * hitoe-hitoe actor が接続してきたら、callerを立てる。
 * caller が report イベントを受け取ったら、 DB に report データを突っ込む
 */
const co = require('co')
const sugoObserver = require('sugo-observer')
const sugoCaller = require('sugo-caller')
const ReportModel = require('../db/report_model')
const URL = require('url')
const debug = require('debug')('sg:hitoe-observer')

const HUB_URL = process.env.HUB_URL || 'http://localhost:3000'
const HUB_PROTOCOL = URL.parse(HUB_URL).protocol
const HUB_HOST = URL.parse(HUB_URL).host
const CALLER_URL = `${HUB_URL}/callers`

function observe () {
  return co(function * () {
    let observer = sugoObserver(observeAndroid, {
      protocol: HUB_PROTOCOL,
      host: HUB_HOST
    })

    yield observer.start()
  }).catch((err) => console.error(err))
}

/**
 * サーバーを監視
 */
function observeAndroid ({data, event}) {
  return co(function * () {
    // こんな感じのときに捕捉する
    // { event: 'actor:update', data: { key: 'qq:hitoe:01', spec: { hitoe: [Object] } } }
    let actorKey = data.key
    let isAndroidSetup = event === 'actor:update' &&
                         actorKey.startsWith('qq:hitoe:') &&
                         data.spec.hitoe
    if (!isAndroidSetup) {
      return
    }

    debug('Trying to connect caller: ', actorKey)
    let caller = sugoCaller(CALLER_URL)
    let actor = yield caller.connect(actorKey)
    let hitoe = actor.get('hitoe')
    if (!hitoe) {
      throw new Error('Cannot get an hitoe module.')
    }
    hitoe.on('warning', pushReportDb('warning'))
    hitoe.on('emergency', pushReportDb('emergency'))
    hitoe.on('error', (err) => { debug(err) })
  }).catch((err) => { debug(err) })
}

/**
 * 通報データをDBにつっこむ
 */
function pushReportDb (report) {
  return (event) => {
    return co(function * () {
      report.event = event
      debug('Observer recieve report', report)
      let Report = ReportModel()
      yield Report.create(report)
    })
  }
}

module.exports = observe

if (!module.parent) {
  observe()
}
