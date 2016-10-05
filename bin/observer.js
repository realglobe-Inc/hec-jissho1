#!/usr/bin/env node
const co = require('co')
const sugoObserver = require('sugo-observer')
const sugoCaller = require('sugo-caller')
const ReportModel = require('../db/report_model')
const OpenReportModel = require('../db/open_report_model')
const URL = require('url')
const debug = require('debug')('sg:hitoe-observer')

const HUB_URL = process.env.HUB_URL || 'http://localhost:3000'
const HUB_PROTOCOL = URL.parse(HUB_URL).protocol
const HUB_HOST = URL.parse(HUB_URL).host
const CALLER_URL = `${HUB_URL}/callers`

// 同一 key による hitoe caller はたかだか 1 つ立てる
let callerHolder = {}
// {[actorKey]: reportId}
let reportIdHolder = {}

/**
 * hitoe actor の接続を監視する。
 * hitoe-hitoe actor が接続してきたら、callerを立てる。
 * caller が report イベントを受け取ったら、 DB に report データを突っ込む
 */
function observe () {
  return co(function * () {
    let observer = sugoObserver(observeHitoe, {
      protocol: HUB_PROTOCOL,
      host: HUB_HOST
    })

    yield observer.start()
  }).catch((err) => console.error(err))
}

// --- Private functions ---

/**
 * サーバーを監視
 */
function observeHitoe ({data, event}) {
  return co(function * () {
    let actorKey = data.key
    // hitoe actor のイベントでなければ無視する
    let isHitoe = event.startsWith('actor') && actorKey.startsWith('qq:hitoe:')
    if (!isHitoe) {
      return
    }

    debug({data, event})
    // 接続時
    if (event === 'actor:update' && data.spec.hitoe) {
      // caller
      debug('Trying to connect caller: ', actorKey)
      let caller = sugoCaller(CALLER_URL)
      let actor = yield caller.connect(actorKey)
      let hitoe = actor.get('hitoe')
      if (!hitoe) {
        throw new Error('Cannot get an hitoe module.')
      }
      // holder
      let report_id = createReportId(actorKey)
      debug(report_id)
      callerHolder[actorKey] = actor
      reportIdHolder[actorKey] = report_id
      debug(reportIdHolder)
      // event
      hitoe.on('warning', pushReportDb(actorKey)('warning'))
      hitoe.on('emergency', pushReportDb(actorKey)('emergency'))
      hitoe.on('error', (err) => { debug(err) })
      // db
      yield OpenReportModel().create({ report_id })
    }

    // 切断時
    if (event === 'actor:teardown') {
      let actor = callerHolder[actorKey]
      if (!actor) {
        return
      }
      delete callerHolder[actorKey]
      delete reportIdHolder[actorKey]
      try {
        yield actor.disconnect(actorKey)
      } catch (e) {
        // エラーが出ても接続はちゃんと切れる
      }
    }
  }).catch((err) => { debug(err) })
}

/**
 * 通報データをDBにつっこむ
 */
function pushReportDb (actorKey) {
  return (event) => {
    return (report) => {
      return co(function * () {
        let report_id = reportIdHolder[actorKey]
        let [lat, lng] = report.location
        let {heartRate, date} = report
        let data = {
          report_id,
          lat,
          lng,
          event,
          heartRate,
          date
        }
        debug('Observer recieve report', data)
        let Report = ReportModel()
        yield Report.create(data)
      })
    }
  }
}

/**
* 通報ID(report_id)は actorKey と actor の最初の接続時間でつける。
 */
function createReportId (actorKey) {
  return actorKey + '-' + (new Date()).toISOString()
}

module.exports = observe

if (!module.parent) {
  observe()
}
