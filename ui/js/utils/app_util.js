/**
 * Application util functions
 */
import store from '../store'
import actions from '../actions'
import co from 'co'
import request from 'browser-request'
import urls from './urls'
import callerManager from './caller_manager'
import {MODAL} from '../constants'

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
    let state = store.getState()
    let shouldSkip = state.warningDisplay.nowWarning
    if (shouldSkip) {
      return
    }
    // 情報画面の表示
    let {infoDisplay} = state
    if (!infoDisplay) {
      store.dispatch(actions.toggleInfoDisplay())
    }
    // 音
    // TODO loop
    let audio = document.createElement('audio')
    audio.src = 'warning.mp3'
    audio.autoplay = true
    const warningFunc = setInterval(() => {
      debug('toggle warning')
      store.dispatch(actions.toggleWarningDisplay())
    }, 600)
    store.dispatch(actions.startWarning(warningFunc))
    store.dispatch(actions.toggleModal(MODAL.OK_WARNING))
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
  },
  /**
   * 緯度経度から住所を取得する
   */
  getAddress ({lat, lng}) {
    return new Promise((resolve, reject) => {
      request({
        method: 'GET',
        url: urls.geocode({lat, lng}),
        json: true
      }, (err, resp, body) => {
        if (err) {
          reject(err)
          return
        }
        // Like this, '日本, 〒101-0061 東京都千代田区三崎町２丁目２０−４ 八木ビル'
        // Format '千代田区三崎町２丁目２０−４'
        let fullAddress = body.results[0].formatted_address
        let address = fullAddress.split(' ')[2].replace(/.+?[県都府道]/, '')
        resolve(address)
      })
    })
  }
}
