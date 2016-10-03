import sugoObserver from 'sugo-observer'
import sugoCaller from 'sugo-caller'
import hubAgent from 'sugo-hub/shim/browser/agent'
import actions from '../actions'
import co from 'co'
import store from '../store'

const debug = require('debug')('hec:caller_manager')

const {host, protocol} = window.location
const CLOUD_URL = `${protocol}//${host}`
const CALLER_URL = `${CLOUD_URL}/callers`

/**
 * ブラウザロード時に呼び出され、接続されている actor について caller をつくる
 */
function connectCallers () {
  return co(function * () {
    let actors = yield hubAgent(CLOUD_URL).actors()
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
      // { event: 'actor:update', data: { key: 'android-hitoe-01', spec: { android: [Object] } } }
      let actorKey = data.key
      let allowedModules = ['drone', 'android']
      let shouldConnect = event === 'actor:update' &&
                          allowedModules.includes(Object.keys(data.spec)[0])
      if (!shouldConnect) {
        return
      }
      _connectCaller(actorKey)
    }, {
      protocol, host
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
    let caller = sugoCaller(CALLER_URL, {})
    let actor = yield caller.connect(key)
    let type = _moduleType(actor)
    switch (type) {
      case 'drone':
        {
          let drone = actor.get('drone')
          yield _initializeDrone(key, drone)
        }
        return
      case 'android':
        {
          let android = actor.get('android')
          yield _initializeAndroid(key, android)
        }
        return
      default:
        // unknown
    }
  })
}

function _moduleType (actor) {
  let moduleNames = ['drone', 'android']
  for (let name of moduleNames) {
    let has = actor.has(name)
    if (has) {
      return name
    }
  }
  return 'unknown'
}

function _initializeDrone (key, drone) {
  return co(function * () {
    if (!drone) {
      throw new Error('Cannot get drone module.')
    }
    let location = yield drone.getLocation()
    let {type, name, dynamic} = yield drone.info()
    drone.on('location', (location) => {
      store.dispatch(actions.moveMarker({key, location}))
      store.dispatch(actions.addDronePath(location))
    })
    store.dispatch(actions.setDroneActor(drone))
    store.dispatch(actions.addMarker({
      key,
      type,
      name,
      dynamic,
      location
    }))
  })
}

function _initializeAndroid (key, android) {
  return co(function * () {
    if (!android) {
      throw new Error('Cannot get android module.')
    }
    // 今の実装では、最後に通報のあった場所を地図上に表示する
    // let {type, name, dynamic} = yield android.info()
    android.on('report', (report) => {
      debug('Recieved report: ', report.report_id)
      let {lat, lng} = report
      let location = {lat, lng}
      let storeState = store.getState()
      if (storeState.reports.length === 0) {
        store.dispatch(actions.addMarker({
          key: report.report_id,
          type: 'report',
          name: '通報',
          dynamic: false,
          location
        }))
      } else {
        debug('Report marker moving')
        store.dispatch(actions.moveMarker({key: report.report_id, location}))
      }
      store.dispatch(actions.addReport(report))
    })
  })
}
