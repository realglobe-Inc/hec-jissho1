#!/usr/bin/env node
/**
 * Sync Datebase
 */

const co = require('co')
const ReportModel = require('../db/report_model')
const OpenReportModel = require('../db/open_report_model')
const ClosedReportModel = require('../db/closed_report_model')

const force = process.env.FORCE || false

co(function * () {
  let Report = ReportModel()
  yield Report.sync({ force })

  let OpenReport = OpenReportModel()
  yield OpenReport.sync({ force })

  let ClosedReport = ClosedReportModel()
  yield ClosedReport.sync({ force })
}).catch((err) => { console.error(err) })
