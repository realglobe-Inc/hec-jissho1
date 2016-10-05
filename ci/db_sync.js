#!/usr/bin/env node
/**
 * Sync Datebase
 */

const co = require('co')
const { exec } = require('child_process')
const ReportModel = require('../db/report_model')
const OpenReportModel = require('../db/open_report_model')
const { db } = require('../env')
const {
  DB_DOCKER_CONTAINER_NAME
} = db

co(function * () {
  // MySQL Docker Container が立っているか確認
  if (process.env.NODE_ENV !== 'production') {
    yield new Promise((resolve, reject) => {
      exec(`docker ps | grep ${DB_DOCKER_CONTAINER_NAME}`, (err) => {
        err ? reject('MySQL Docker Container isn\'t running. What you should first is "./ci/db_run.js"') : resolve()
      })
    })
  }

  let Report = ReportModel()
  yield Report.sync({ force: true })

  let OpenReport = OpenReportModel()
  yield OpenReport.sync({ force: true })
  // Mock データ
  // yield Report.create({
  //   device_id: 'android-01',
  //   device_name: 'Android',
  //   report_id: 'report-01',
  //   lat: 35.700275,
  //   lng: 139.753314,
  //   info: '調子が悪い',
  //   date: new Date()
  // })
}).catch((err) => { console.error(err) })
