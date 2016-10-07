const co = require('co')
const bRequest = require('browser-request')
const camelcase = require('camelcase')
const urls = require('../utils/urls')

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
  let translated = {}
  let keys = Object.keys(report)
  for (let key of keys) {
    let value = report[key]
    translated[camelcase(key)] = _isDate(value)
      ? new Date(value)
      : value
  }
  return translated
}

// --- Actions ---

const fetchAllReports = () => (dispatch, getState) => co(function * () {
  let reportArray = yield _request(urls.openReports()) // 単純な配列
  // actorKey を key としたオブジェクトに。
  let reports = reportArray.reduce((obj, repo) => {
    let report = _translate(repo)
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

const addReport = ({key, report: repo}) => {
  let report = _translate(repo)
  report.actorKey = key
  return {
    type: 'ADD_REPORT',
    report
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
