import { createStore, applyMiddleware, compose } from 'redux'
import createLogger from 'redux-logger'
import thunkMiddleware from 'redux-thunk'
import Reducer from './reducers'
import storeUtil from './utils/store_util'
import actions from './actions'
import appUtil from './utils/app_util'
import { MARKER_TYPE, MARKER_NAME } from './constants'
import { mapCenter } from '../config'

const debug = require('debug')('hec:store')
const middlewares = [thunkMiddleware]

if (process.env.NODE_ENV !== 'production') {
  const logger = createLogger()
  // middlewares.push(logger)
}

let store = createStore(
  Reducer,
  compose(
    applyMiddleware(...middlewares),
    window.devToolsExtension ? window.devToolsExtension() : f => f
  )
)

Object.assign(store, {
  initializeMarkers () {
    const s = this
    // 閲覧者
    if (navigator.geolocation) {
      appUtil.getMyLocation()
        .then((location) => {
          s.dispatch(actions.addMarker({
            key: 'you',
            type: MARKER_TYPE.PERSON,
            name: 'YOU',
            dynamic: true,
            location
          }))
        }).then(() => {
          // 一定時間ごとに更新
          setInterval(() => {
            appUtil.getMyLocation()
            .then((location) => {
              s.dispatch(actions.moveMarker({
                key: 'you',
                location
              }))
            })
          }, 5000)
        }).catch((err) => {
          console.log('閲覧者の位置情報を取得できませんでした')
        })
    } else {
      debug('Not found navigator.geolocation')
    }
    // 本部
    s.dispatch(actions.addMarker({
      key: 'center',
      type: MARKER_TYPE.DEFAULT,
      name: '本部',
      dynamic: true,
      location: mapCenter
    }))
    // 最新の通報を地図上に表示する
    let state = s.getState()
    let {reports} = state
    let actorKeys = Object.keys(reports)
    for (let i = 0; i < actorKeys.length; i++) {
      let actorKey = actorKeys[i]
      let latest = storeUtil.getLatestReport({state, actorKey})
      let first = storeUtil.getFirstReport({state, actorKey})
      if (latest) {
        // marker の key は reportId
        let location = {lat: latest.lat, lng: latest.lng}
        debug(actorKey)
        appUtil.getAddress(location)
          .catch((e) => {
            return '詳細不明'
          })
          .then((address) => {
            s.dispatch(actions.addMarker({
              key: actorKey,
              location,
              address,
              type: MARKER_TYPE.REPORT,
              name: MARKER_NAME.REPORTER + '@' + appUtil.formatTime(first.date),
              dynamic: false
            }))
            // 最初の通報を情報欄に表示する
            if (i === 0) {
              s.dispatch(actions.changeMapCenter(location))
              s.dispatch(actions.selectMarkerKey(actorKey))
            }
          })
      }
    }
  }
})

module.exports = store
