/**
 * Application util functions
 */
import store from '../store'
import actions from '../actions'
import co from 'co'

const debug = require('debug')('hec:app_util')

export default {
  /**
   * Date のインスタンスをいい感じにフォーマットした文字列にして返す
   */
  formatTime (date) {
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
  },
  /**
   * スマホかどうか
   */
  isSmartPhone () {
    let ua = navigator.userAgent
    return ua.includes('iPhone') || ua.includes('iPad') || ua.includes('iPod') || ua.includes('Android')
  }
}
