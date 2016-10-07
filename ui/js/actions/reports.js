const co = require('co')
const bRequest = require('browser-request')
const urls = require('../utils/urls')
const { formatDbToUI, formatRawToUI } = require('../../../lib/common_func')

// --- Private functions ---

function _request (url) {
  return new Promise((resolve, reject) => {
    let json = true
    let method = 'GET'
    bRequest({method, url, json}, (err, resp, body) => {
      err ? reject(err) : resolve(body)
    })
  })
}

// --- Actions ---

const fetchAllReports = () => (dispatch, getState) => co(function * () {
  let reportArray = yield _request(urls.openReports()) // 単純な配列
  // actorKey を key としたオブジェクトに。
  let reports = reportArray.reduce((obj, repo) => {
    let report = formatDbToUI(repo)
    let {actorKey} = report
    if (obj[actorKey]) {
      obj[actorKey].push(report)
      return obj
    } else {
      return Object.assign(obj, { [actorKey]: [report] })
    }
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
