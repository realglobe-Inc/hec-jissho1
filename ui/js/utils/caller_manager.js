import sugoObserver from 'sugo-observer'
import sugoCaller from 'sugo-caller'
import hubAgent from 'sugo-hub/shim/browser/agent'
import actions from '../actions'
import co from 'co'
import store from '../store'
import appUtil from './app_util'
import urls from './urls'
import assert from 'assert'
import { MARKER_TYPE, HITOE_EVENT, OBSERVER_EVENT, MARKER_NAME, HITOE_MODULE_NAME } from '../constants'

const debug = require('debug')('hec:caller_manager')

/**
 * ブラウザロード時に呼び出され、接続されている actor について caller をつくる
 */
function connectCallers () {
  return co(function * () {
    let actors = yield hubAgent(urls.origin()).actors()
    for (let actor of actors) {
      yield connectCaller(actor.key)
    }
  })
}

/**
 * サーバーに接続されている actor を監視して caller の更新をする
 */
function observeActors () {
  return co(function * () {
    let observer = sugoObserver(_handleOberver, {
      protocol: urls.protocol(),
      host: urls.host()
    })
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
    let Caller = sugoCaller(urls.callers(), {})
    let caller = yield Caller.connect(key)
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
  let shouldIgnore = !((event === OBSERVER_EVENT.ACTOR_CONNECT && ALLOWED_MODULES.includes(Object.keys(data.spec)[0])) ||
                        event === OBSERVER_EVENT.ACTOR_TEARDOWN)
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
    disconnectCaller(data.key)
  }
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
        store.dispatch(actions.addMarker({
          key,
          location, // 確認、 marker に heartRate, date は不必要だよね？
          type: MARKER_TYPE.REPORT,
          name: MARKER_NAME.REPORTER,
          dynamic: false
        }))
        appUtil.warnDisplay()
      } else {
        debug('Report marker moving')
        store.dispatch(actions.moveMarker({key, location}))
      }
      store.dispatch(actions.addReport({report, event: HITOE_EVENT.EMERGENCY, actorKey: key}))
    })
  })
}
