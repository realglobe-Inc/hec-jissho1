const co = require('co')
const bRequest = require('browser-request')
const camelcase = require('camelcase')

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

function _isDate (str) {
  // 2016-09-27T05:43:07.000Z
  return /\d+-\d+-\d+T\d+:\d+:\d+\.\d+Z/.test(str)
}

function _translate (report) {
  let translateed = {}
  let keys = Object.keys(report)
  for (let key of keys) {
    let value = report[key]
    translateed[camelcase(key)] = _isDate(value)
      ? new Date(value)
      : value
  }
  return translateed
}

// --- Actions ---

const fetchAllReports = () => (dispatch, getState) => co(function * () {
  let reports = yield _request('/reports')
  reports = reports.map((report) => _translate(report)).sort((a, b) => b.date - a.date)
  dispatch({
    type: 'FETCH_ALL_REPORTS',
    reports
  })
})

const addReport = (report) => {
  report = _translate(report)
  return {
    type: 'ADD_REPORT',
    report
  }
}

export default {
  fetchAllReports,
  addReport
}
