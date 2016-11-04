import sugoObserver from 'sugo-observer'
import sugoCaller from 'sugo-caller'
import actions from '../actions'
import co from 'co'
import store from '../store'
import appUtil from './app_util'
import urls from './urls'
import assert from 'assert'
import { MARKER_TYPE, HITOE_EVENT, OBSERVER_EVENT, MARKER_NAME, HITOE_MODULE_NAME, HITOE_ACTORKEY_PREFIX } from '../constants'

const debug = require('debug')('hec:caller_manager')

/**
 * ブラウザロード時に呼び出され、接続されている actor について caller をつくる
 */
function connectCallers () {
  return co(function * () {
    // store に reports がフェッチされていることが前提
    let reports = store.getState().reports
    let openActorKeys = Object.keys(reports)
    for (let key of openActorKeys) {
      yield connectCaller(key)
    }
  })
}

/**
 * サーバーに接続されている actor を監視して caller の更新をする
 */
function observeActors () {
  return co(function * () {
    let observer = sugoObserver(_handleOberver, urls.observers())
    yield observer.start()
    debug('Observer started')
  })
}

function connectCaller (key) {
  return co(function * () {
    // hitoe caller しかいない前提
    let callerExists = !!store.getState().hitoeCallers[key]
    if (callerExists) {
      return
    }
    let Caller = sugoCaller(urls.callers())
    let caller = yield Caller.connect(key)
    debug(`Connected caller: ${key}`)
    let type = _moduleType(caller)
    switch (type) {
      case HITOE_MODULE_NAME:
        {
          yield _initializeHitoe(key, caller)
        }
        return
      default:
        // unknown
    }
  }).catch((err) => console.error(err))
}

function disconnectCaller (key) {
  return co(function * () {
    let caller = store.getState().hitoeCallers[key]
    if (!caller) {
      debug('Cannot detect caller')
      return
    }
    store.dispatch(actions.removeHitoeCaller(key))
    yield caller.disconnect(key)
  }).catch((err) => console.error(err))
}

export default {
  connectCallers,
  observeActors,
  connectCaller,
  disconnectCaller
}

// --- Private functions ---

// const ALLOWED_EVENTS = [OBSERVER_EVENT.ACTOR_CONNECT, OBSERVER_EVENT.ACTOR_TEARDOWN]
const ALLOWED_MODULES = [HITOE_MODULE_NAME]

function _handleOberver ({data, event}) {
  // こんな感じのときに捕捉する
  // spec は許可された Module のみ。
  // { event: 'actor:update', data: { key: 'qq:hitoe:01', spec: { hitoe: [Object] } } }
  let shouldIgnore = _shouldIgnore({data, event})
  if (shouldIgnore) {
    return
  }
  debug(event, data.key)
  // 接続時
  if (event === OBSERVER_EVENT.ACTOR_CONNECT) {
    connectCaller(data.key)
  }

  // 切断時
  if (event === OBSERVER_EVENT.ACTOR_TEARDOWN) {
    // FIXME うまく接続が切れていない
    disconnectCaller(data.key)
  }
}

function _shouldIgnore ({event, data}) {
  if (typeof data.key !== 'string') {
    return true
  }
  if (!data.key.startsWith(HITOE_ACTORKEY_PREFIX)) {
    return true
  }
  if (event === OBSERVER_EVENT.ACTOR_TEARDOWN) {
    return false
  }
  if (event === OBSERVER_EVENT.ACTOR_CONNECT && ALLOWED_MODULES.includes(Object.keys(data.spec)[0])) {
    return false
  }
  return true
}

function _moduleType (caller) {
  for (let name of ALLOWED_MODULES) {
    let has = caller.has(name)
    if (has) {
      return name
    }
  }
  return 'unknown'
}

function _initializeHitoe (key, caller) {
  return co(function * () {
    store.dispatch(actions.addHitoeCaller({
      key,
      caller
    }))
    // emergency イベントのときに通報とする
    let hitoe = caller.get(HITOE_MODULE_NAME)
    hitoe.on(HITOE_EVENT.EMERGENCY, (report) => {
      // ここに飛んでくる report は生データ
      debug('Recieved report: ', report)
      let [lat, lng] = report.location
      let location = {lat, lng}
      let storeState = store.getState()
      assert.ok(storeState)
      let isFirst = !storeState.reports[key]
      if (isFirst) {
        appUtil.getAddress(location)
          .catch((e) => {
            return '詳細不明'
          })
          .then((address) => {
            store.dispatch(actions.addMarker({
              key,
              location,
              address,
              type: MARKER_TYPE.REPORT,
              name: MARKER_NAME.REPORTER + '@' + appUtil.formatTime(report.date),
              dynamic: false
            }))
          })
        store.dispatch(actions.selectMarkerKey(key))
        store.dispatch(actions.changeMapCenter(location))
        appUtil.warnDisplay()
      } else {
        debug('Report marker moving')
        store.dispatch(actions.moveMarker({key, location}))
      }
      store.dispatch(actions.addReport({report, event: HITOE_EVENT.EMERGENCY, actorKey: key}))
    })
  })
}
