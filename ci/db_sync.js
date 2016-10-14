#!/usr/bin/env node
/**
 * Sync Datebase
 */

const co = require('co')
const ReportModel = require('../db/report_model')
const OpenReportModel = require('../db/open_report_model')
const ClosedReportModel = require('../db/closed_report_model')

co(function * () {
  let Report = ReportModel()
  yield Report.sync({ force: true })

  let OpenReport = OpenReportModel()
  yield OpenReport.sync({ force: true })

  let ClosedReport = ClosedReportModel()
  yield ClosedReport.sync({ force: true })
}).catch((err) => { console.error(err) })
