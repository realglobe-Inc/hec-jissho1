const {resolve} = require('url')
const API_ROUTES = require('../../../lib/api_routes')
const {apiKey} = require('../../config')
let {protocol, host} = window.location
const ORIGIN_URL = `${protocol}//${host}`

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
    return resolve(ORIGIN_URL, API_ROUTES.OPEN_REPORTS)
  },
  /**
   * クローズされた通報情報
   */
  closedReports () {
    return resolve(ORIGIN_URL, API_ROUTES.CLOSED_REPORTS)
  },
  /**
   * 通報をクローズする
   */
  closeReport () {
    return resolve(ORIGIN_URL, API_ROUTES.CLOSE_REPORT)
  },
  /**
   * 本部の位置情報
   */
  centerLocation () {
    return resolve(ORIGIN_URL, API_ROUTES.CENTER_LOCATION)
  },
  /**
   * SUGO Caller
   */
  callers () {
    return resolve(ORIGIN_URL, 'callers')
  },
  /**
   * Google geocode API (reverse)
   */
  geocode ({lat, lng}) {
    return `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}&language=ja`
  }
}
