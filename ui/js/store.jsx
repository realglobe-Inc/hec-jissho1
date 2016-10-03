import { createStore, applyMiddleware, compose } from 'redux'
import createLogger from 'redux-logger'
import thunkMiddleware from 'redux-thunk'
import Reducer from './reducers'
import storeUtil from './utils/store_util'
import actions from './actions'

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
    // 本部
    this.dispatch(actions.addMarker({
      key: 'center',
      type: 'center',
      name: '本部',
      dynamic: false,
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
        key: latest.reportId,
        type: 'report',
        name: '通報',
        dynamic: false,
        location
      }))
    }
  }
})

module.exports = store
