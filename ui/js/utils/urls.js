const API_ROUTES = require('../../../lib/api_routes')
const {apiKey} = require('../../config')
let {protocol, host} = window.location
const ORIGIN_URL = `${protocol}//${host}` + (process.env.NODE_ENV === 'production' ? '/jissho1' : '')

module.exports = {
  protocol () {
    return protocol
  },
  host () {
    return host
  },
  origin () {
    return ORIGIN_URL
  },
  /**
   * クローズされていない通報情報
   */
  openReports () {
    return ORIGIN_URL + API_ROUTES.OPEN_REPORTS
  },
  /**
   * クローズされた通報情報
   */
  closedReports () {
    return ORIGIN_URL + API_ROUTES.CLOSED_REPORTS
  },
  /**
   * 通報をクローズする
   */
  closeReport () {
    return ORIGIN_URL + API_ROUTES.CLOSE_REPORT
  },
  /**
   * 本部の位置情報
   */
  centerLocation () {
    return ORIGIN_URL + API_ROUTES.CENTER_LOCATION
  },
  /**
   * SUGO Caller
   */
  callers () {
    if (process.env.NODE_ENV === 'production') {
      return {
        protocol,
        host,
        path: '/jissho1/socket.io'
      }
    } else {
      return { protocol, host }
    }
  },
  /**
   * SUGO observers
   */
  observers () {
    if (process.env.NODE_ENV === 'production') {
      return {
        protocol,
        host,
        path: '/jissho1/socket.io'
      }
    } else {
      return { protocol, host }
    }
  },
  /**
   * Google geocode API (reverse)
   */
  geocode ({lat, lng}) {
    return `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}&language=ja`
  }
}
