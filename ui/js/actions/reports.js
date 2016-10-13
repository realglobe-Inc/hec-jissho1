const co = require('co')
const urls = require('../utils/urls')
const {request} = require('../utils/js_util')
const { formatDbToUI, formatRawToUI } = require('../../../lib/common_func')

const fetchAllReports = () => (dispatch, getState) => co(function * () {
  let reportArray = yield request({
    method: 'GET',
    url: urls.openReports(),
    json: true
  })
  // actorKey を key としたオブジェクトに。
  let reports = reportArray.reduce((obj, repo) => {
    let report = formatDbToUI(repo)
    let {actorKey} = report
    obj[actorKey] = obj[actorKey] || []
    obj[actorKey].push(report)
    return obj
  }, {})
  // sort
  for (let key of Object.keys(reports)) {
    reports[key] = reports[key].sort((a, b) => a.date - b.date)
  }
  dispatch({
    type: 'FETCH_ALL_REPORTS',
    reports
  })
})

const addReport = ({report, actorKey, event}) => {
  let data = formatRawToUI({report, actorKey, event})
  return {
    type: 'ADD_REPORT',
    report: data
  }
}

const clearReports = (actorKey) => {
  return {
    type: 'CLEAR_REPORTS',
    actorKey
  }
}

export default {
  fetchAllReports,
  addReport,
  clearReports
}
