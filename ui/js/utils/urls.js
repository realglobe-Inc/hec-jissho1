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
    return `${ORIGIN_URL}/reports`
  },
  /**
   * 通報をクローズする
   */
  closeReports () {
    return `${ORIGIN_URL}/close_report`
  },
  /**
   * SUGO Caller
   */
  callers () {
    return `${ORIGIN_URL}/callers`
  }
}
