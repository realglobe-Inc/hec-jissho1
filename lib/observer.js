const sugoObserver = require('sugo-observer')
const sugoCaller = require('sugo-caller')
const ReportModel = require('../db/report_model')
const OpenReportModel = require('../db/open_report_model')
const co = require('co')
const debug = require('debug')('hec:hitoe-observer')

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
    s.reportIds = {}
  }

  /**
   * 監視を開始する
   */
  observe (options) {
    const s = this
    return co(function * () {
      let {protocol, host} = s.location
      let observer = sugoObserver(s._handler.bind(s), {
        protocol,
        host
      })
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
        debug(s.location)
        let {protocol, host} = s.location
        let caller = sugoCaller(`${protocol}//${host}/callers`)
        let actor = yield caller.connect(actorKey)
        let hitoe = actor.get('hitoe')
        if (!hitoe) {
          throw new Error('Cannot get an hitoe module.')
        }
        // report_id は一時的な識別子なのでさしあたり server側と client 側で一致している必要はない
        // 将来的には hitoe 側で設定したらいいと思う
        let report_id = actorKey + '#' + (new Date()).toISOString()
        debug(report_id)
        s.callers[actorKey] = actor
        s.reportIds[actorKey] = report_id
        // event
        hitoe.on('warning', s._pushReportDb(actorKey)('warning'))
        hitoe.on('emergency', s._pushReportDb(actorKey)('emergency'))
        hitoe.on('error', (err) => { debug(err) })
        // db
        yield OpenReportModel().create({ report_id })
      }

      // 切断時
      if (event === 'actor:teardown') {
        let actor = s.callers[actorKey]
        if (!actor) {
          return
        }
        delete s.callers[actorKey]
        delete s.reportIds[actorKey]
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
  _pushReportDb (actorKey) {
    const s = this
    return (event) => {
      return (report) => {
        return co(function * () {
          let report_id = s.reportIds[actorKey]
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
}

module.exports = HitoeObserver
