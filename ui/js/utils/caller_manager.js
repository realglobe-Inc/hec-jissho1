import sugoObserver from 'sugo-observer'
import sugoCaller from 'sugo-caller'
import hubAgent from 'sugo-hub/shim/browser/agent'
import actions from '../actions'
import co from 'co'
import store from '../store'
import appUtil from './app_util'
import urls from './urls'

const debug = require('debug')('hec:caller_manager')

/**
 * ブラウザロード時に呼び出され、接続されている actor について caller をつくる
 */
function connectCallers () {
  return co(function * () {
    let actors = yield hubAgent(urls.origin()).actors()
    for (let actor of actors) {
      yield _connectCaller(actor.key)
    }
  })
}

/**
 * サーバーに接続されている actor を監視して caller の更新をする
 */
function observeActors () {
  return co(function * () {
    let observer = sugoObserver(({data, event}) => {
      // こんな感じのときに捕捉する
      // spec は許可された Module のみ。
      // { event: 'actor:update', data: { key: 'qq:hitoe:01', spec: { hitoe: [Object] } } }
      let actorKey = data.key
      let allowedModules = ['hitoe']
      let shouldConnect = event === 'actor:update' &&
                          allowedModules.includes(Object.keys(data.spec)[0])
      if (!shouldConnect) {
        return
      }
      _connectCaller(actorKey)
    }, {
      protocol: urls.protocol(),
      host: urls.host()
    })
    yield observer.start()
    debug('Observer started')
  })
}

export default {
  connectCallers,
  observeActors
}

// --- Private functions ---

function _connectCaller (key) {
  return co(function * () {
    debug('Detected actor: ', key)
    let existingConnection = !~store.getState().markers.findIndex(marker => marker.key === key)
    if (!existingConnection) {
      return
    }
    let caller = sugoCaller(urls.callers(), {})
    let actor = yield caller.connect(key)
    let type = _moduleType(actor)
    switch (type) {
      case 'hitoe':
        {
          let hitoe = actor.get('hitoe')
          yield _initializeHitoe(key, hitoe)
        }
        return
      default:
        // unknown
    }
  })
}

function _moduleType (actor) {
  let moduleNames = ['hitoe']
  for (let name of moduleNames) {
    let has = actor.has(name)
    if (has) {
      return name
    }
  }
  return 'unknown'
}

function _initializeHitoe (key, hitoe) {
  return co(function * () {
    if (!hitoe) {
      throw new Error('Cannot get hitoe module.')
    }
    // emergency イベントのときに通報とする
    hitoe.on('emergency', (report) => {
      debug('Recieved report: ', report)
      let [lat, lng] = report.location
      let location = {lat, lng}
      let {heartRate, date} = report
      let storeState = store.getState()
      if (storeState.reports.length === 0) {
        store.dispatch(actions.addMarker({
          key: 'report',
          location,
          heartRate,
          date: new Date(date),
          type: 'report',
          name: '通報者',
          dynamic: false
        }))
        store.dispatch(actions.addHitoeCaller({
          key,
          hitoe
        }))
        appUtil.warnDisplay()
      } else {
        debug('Report marker moving')
        store.dispatch(actions.moveMarker({key: 'report', location}))
      }
      store.dispatch(actions.addReport(report))
    })
  })
}
