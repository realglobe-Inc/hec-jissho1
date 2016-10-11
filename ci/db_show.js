#!/usr/bin/env node
/**
 * Show Datebase data
 */

const co = require('co')
const { exec } = require('child_process')
const ReportModel = require('../db/report_model')
const OpenReportModel = require('../db/open_report_model')
const ClosedReportModel = require('../db/closed_report_model')
const { db } = require('../env')
const {
  DB_DOCKER_CONTAINER_NAME
} = db

co(function * () {
  // MySQL Docker Container が立っているか確認
  yield new Promise((resolve, reject) => {
    exec(`docker ps | grep ${DB_DOCKER_CONTAINER_NAME}`, (err) => {
      err ? reject('MySQL Docker Container isn\'t running. What you should first is "./ci/db_run.js"') : resolve()
    })
  })

  let Report = ReportModel()
  let reports = yield Report.findAll()
  console.log('--- report ----')
  console.log(reports.map((data) => data.dataValues))

  let OpenReport = OpenReportModel()
  let opens = yield OpenReport.findAll()
  console.log('\n--- open report ---')
  console.log(opens.map((data) => data.dataValues))

  let ClosedReport = ClosedReportModel()
  let closed = yield ClosedReport.findAll()
  console.log('\n--- closed report ---')
  console.log(closed.map((data) => data.dataValues))
}).catch((err) => { console.error(err) })
