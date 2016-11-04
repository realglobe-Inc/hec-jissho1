const sugoObserver = require('sugo-observer')
const sugoCaller = require('sugo-caller')
const ReportModel = require('../db/report_model')
const OpenReportModel = require('../db/open_report_model')
const co = require('co')
const debug = require('debug')('hec:hitoe-observer')
const { formatRawToDb } = require('../lib/common_func')

/**
 * sugo-hub を監視して、 hitoe actor の接続を検出する。
 */
class HitoeObserver {
  constructor (options) {
    let {
      protocol,
      host
    } = options
    const s = this
    s.location = {
      protocol,
      host
    }
    s.observer = null
    s.callers = {}
  }

  /**
   * 監視を開始する
   */
  observe (options) {
    const s = this
    return co(function * () {
      let {protocol, host} = s.location
      let observer = sugoObserver(s._handler.bind(s), {protocol, host})
      s.observer = observer
      yield observer.start()
    })
  }

  /**
   * 監視を終了する
   */
  stop () {
    const s = this
    return co(function * () {
      if (!s.observer) {
        debug('Observer does not exist')
        return
      }
      yield s.observer.stop()
    })
  }

  /**
   * observer に渡す関数
   */
  _handler ({data, event}) {
    const s = this
    return co(function * () {
      let actorKey = data.key
      // hitoe actor のイベントでなければ無視する
      let isHitoe = event.startsWith('actor') && actorKey.startsWith('qq:hitoe:')
      if (!isHitoe) {
        return
      }

      // 接続時
      if (event === 'actor:update' && data.spec.hitoe) {
        // caller
        debug('Trying to connect caller: ', actorKey)
        let {protocol, host} = s.location
        let caller = sugoCaller({protocol, host})
        let actor = yield caller.connect(actorKey)
        let hitoe = actor.get('hitoe')
        if (!hitoe) {
          throw new Error('Cannot get an hitoe module.')
        }
        s.callers[actorKey] = actor
        // event
        // hitoe.on('warning', s._pushReportDb(actorKey)('warning'))
        let event = 'emergency'
        hitoe.on(event, s._pushReportDb({actorKey, event}))
        hitoe.on('error', (err) => { debug(err) })
      }

      // 切断時
      if (event === 'actor:teardown') {
        let actor = s.callers[actorKey]
        if (!actor) {
          return
        }
        delete s.callers[actorKey]
        try {
          yield actor.disconnect(actorKey)
        } catch (e) {
          // エラーが出ても接続はちゃんと切れる
        }
      }
    }).catch((err) => console.error(err))
  }

  /**
   * 通報データをDBにつっこむ
   */
  _pushReportDb ({actorKey, event}) {
    // 初めて通報が来た時にだけ OpenReport に登録する
    let first = true
    return (report) => co(function * () {
      let data = formatRawToDb({report, actorKey, event})
      debug('Observer recieve report', data)
      yield ReportModel().create(data)
      if (first) {
        first = false
        let {report_full_id, actor_key, report_id} = data
        yield OpenReportModel().create({
          report_full_id, actor_key, report_id
        })
      }
    }).catch((err) => console.error(err))
  }
}

module.exports = HitoeObserver
