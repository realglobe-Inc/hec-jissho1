/**
 * Server 側と UI 側の共通関数
 */
const camelcase = require('camelcase')
const snakecase = require('snake-case')
const CAMEL = 1
const SNAKE = 2
const DELIMITER = '#'

const commonFunc = {
  /**
   * 通報情報 report をフォーマットする
   */
  formatRawToDb ({report, actorKey, event}) {
    let [lat, lng] = report.location
    let {id: reportId, heartRate, date} = report
    let reportFullId = commonFunc.reportFullId({actorKey, reportId})
    let data = _translateCase(SNAKE)({
      reportFullId,
      reportId,
      actorKey,
      heartRate,
      lat,
      lng,
      date,
      event
    })
    return data
  },
  formatDbToUI (report) {
    let formatted = _translateCase(CAMEL)(report)
    for (let key of Object.keys(formatted)) {
      if (_isDate(key)) {
        formatted[key] = new Date(formatted[key])
      }
    }
    return formatted
  },
  formatRawToUI ({report, actorKey, event}) {
    return commonFunc.formatDbToUI(commonFunc.formatRawToDb({report, actorKey, event}))
  },

  /**
   * データベース関係。 actorKey, reportId, reportFullId の三者変換
   */
  reportFullId ({actorKey, reportId}) {
    return `${actorKey}${DELIMITER}${reportId}`
  },
  toActorKey (reportFullId) {
    return reportFullId.split(DELIMITER)[0]
  },
  toReportId (reportFullId) {
    return reportFullId.split(DELIMITER)[1]
  }
}

/**
 * オブジェクトのキーを camelcase(or snakecase) に変換する
 */
function _translateCase (type) {
  return (obj) => {
    let translate = {
      [SNAKE]: snakecase,
      [CAMEL]: camelcase
    }[type]
    let res = {}
    let keys = Object.keys(obj)
    for (let key of keys) {
      res[translate(key)] = obj[key]
    }
    return res
  }
}

function _isDate (key) {
  // RFC 形式
  // example: 2016-09-27T05:43:07.000Z
  return key === 'date' || key === 'createdAt' || key === 'updatedAt'
}

module.exports = commonFunc
