/**
 * Server 側と UI 側の共通関数
 */
const camelcase = require('camelcase')

const commonFunc = {
  /**
   * 通報情報 report をフォーマットする
   */
  formatRawToDb ({report, actorKey, event}) {
    let [lat, lng] = report.location
    let {heartRate, date} = report
    let data = {
      lat,
      lng,
      date,
      event,
      actor_key: actorKey,
      heart_rate: heartRate
    }
    return data
  },
  formatDbToUI (report) {
    let translated = {}
    let keys = Object.keys(report)
    for (let key of keys) {
      let value = report[key]
      translated[camelcase(key)] = _isDate(value)
        ? new Date(value)
        : value
    }
    return translated
  },
  formatRawToUI ({report, actorKey, event}) {
    return commonFunc.formatDbToUI(commonFunc.formatRawToDb({report, actorKey}))
  }
}

function _isDate (str) {
  // example: 2016-09-27T05:43:07.000Z
  return /\d+-\d+-\d+T\d+:\d+:\d+\.\d+Z/.test(str)
}

module.exports = commonFunc
