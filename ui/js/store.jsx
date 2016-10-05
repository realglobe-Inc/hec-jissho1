import { createStore, applyMiddleware, compose } from 'redux'
import createLogger from 'redux-logger'
import thunkMiddleware from 'redux-thunk'
import Reducer from './reducers'
import storeUtil from './utils/store_util'
import actions from './actions'
import appUtil from './utils/app_util'

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
    // 閲覧者
    if (navigator.geolocation) {
      appUtil.getMyLocation()
        .then((location) => {
          this.dispatch(actions.addMarker({
            key: 'you',
            type: 'person',
            name: 'YOU',
            dynamic: true,
            location
          }))
        }).then(() => {
          // 一定時間ごとに更新
          setInterval(() => {
            appUtil.getMyLocation()
            .then((location) => {
              this.dispatch(actions.moveMarker({
                key: 'you',
                location
              }))
            })
          }, 5000)
        })
    } else {
      debug('Not found navigator.geolocation')
    }
    // 本部
    this.dispatch(actions.addMarker({
      key: 'center',
      type: 'center',
      name: '本部',
      dynamic: true,
      location: {
        lat: 35.701562,
        lng: 139.753148
      }
    }))
    // 最新の通報を地図上に表示する
    let state = this.getState()
    let latest = storeUtil.getLatestReport(state)
    if (latest) {
      // marker の key は reportId
      let location = {lat: latest.lat, lng: latest.lng}
      this.dispatch(actions.addMarker({
        key: 'report',
        type: 'report',
        name: '通報者',
        dynamic: false,
        location
      }))
    }
  }
})

module.exports = store
