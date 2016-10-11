/**
 * Application util functions
 */
import store from '../store'
import actions from '../actions'
import co from 'co'
import request from 'browser-request'
import urls from './urls'
import callerManager from './caller_manager'

const debug = require('debug')('hec:app_util')

export default {
  /**
   * 通報をクローズする
   */
  closeReport (actorKey) {
    let closedDate = new Date()
    // Caller
    callerManager.disconnectCaller(actorKey)
    // Store side
    store.dispatch(actions.removeMarker(actorKey))
    store.dispatch(actions.setClosedReport(actorKey))
    store.dispatch(actions.clearReports(actorKey))
    // Server side
    request({
      method: 'POST',
      url: urls.closeReport(),
      json: true,
      body: JSON.stringify({
        actor_key: actorKey,
        closed_date: closedDate.toISOString()
      })
    }, (err, resp, body) => {
      if (err) {
        console.error(err)
      }
    })
  },
  /**
   * Date のインスタンスをいい感じにフォーマットした文字列にして返す
   */
  formatTime (date) {
    if (typeof date === 'string') {
      date = new Date(date)
    }
    let padding = number => ('0' + number).slice(-2)
    let hours = padding(date.getHours())
    let minutes = padding(date.getMinutes())
    let seconds = padding(date.getSeconds())
    let timeStr = `${hours}:${minutes}:${seconds}`
    return timeStr
  },
  /**
   * 画面に警告の効果
   */
  warnDisplay () {
    let interval = 600
    // 情報画面の表示
    let state = store.getState()
    let {infoDisplay} = state
    if (!infoDisplay) {
      store.dispatch(actions.toggleInfoDisplay())
    }
    // 音
    let audio = document.createElement('audio')
    audio.src = 'warning.mp3'
    audio.autoplay = true
    // 画面
    for (let i = 0; i < 4; i++) {
      setTimeout(() => {
        store.dispatch(actions.toggleWarningDisplay())
      }, i * interval)
    }
  },
  /**
   * 自分の位置情報を {lat, lng} で取得する
   */
  getMyLocation () {
    return co(function * () {
      if (!navigator.geolocation) {
        throw new Error('Not found navigator.geolocation')
      }
      let location = yield new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          ({coords}) => {
            let location = {
              lat: coords.latitude,
              lng: coords.longitude
            }
            debug(location)
            resolve(location)
          },
          (err) => {
            reject(err)
          }, {
            enableHighAccuracy: true,
            timeout: 10000
          }
        )
      })
      return location
    })
  }
}
