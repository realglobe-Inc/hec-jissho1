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
    return `${ORIGIN_URL}/api/reports`
  },
  /**
   * クローズされた通報情報
   */
  closedReports () {
    return `${ORIGIN_URL}/api/closed_reports`
  },
  /**
   * 通報をクローズする
   */
  closeReport () {
    return `${ORIGIN_URL}/api/close_report`
  },
  /**
   * SUGO Caller
   */
  callers () {
    return `${ORIGIN_URL}/callers`
  },
  /**
   * Google geocode API (reverse)
   */
  geocode ({lat, lng}) {
    return `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}&language=ja`
  }
}
