#!/usr/bin/env node
/**
 * サーバー側のメイン。 SUGO-Hub サーバーと SUGO-Observer を立てる。
 */

const sugoHub = require('sugo-hub')
const logger = require('koa-logger')()
const ReportModel = require('../db/report_model')
const OpenReportModel = require('../db/open_report_model')
const ClosedReportModel = require('../db/closed_report_model')
const co = require('co')
const env = require('../env')
const commonFunc = require('../lib/common_func')
const {mapCenter} = require('../ui/config')
const API_ROUTES = require('../lib/api_routes')
const observe = require('./observer')

const debug = require('debug')('hec:hub')

console.log(`
NODE_ENV: ${process.env.NODE_ENV}
PORT: ${env.port.SERVER}
REDIS_URL: ${env.redis.URL}
HUB_URL: ${process.env.HUB_URL}
`)

/** 本部の位置 ここにおくとデータを永続化できない */
let centerLocation = mapCenter

co(function * () {
  let server = sugoHub({
    public: [ 'public' ],
    endpoints: {
      /* クローズされていない通報情報 */
      [API_ROUTES.OPEN_REPORTS]: {
        GET: (ctx) => {
          return co(function * () {
            let OpenReport = OpenReportModel()
            let opens = yield OpenReport.findAll()
            if (opens.length === 0) {
              ctx.body = []
              return
            }
            let reportFullIds = opens.map(({report_full_id}) => report_full_id)
            debug('Actor keys: ', reportFullIds)
            let Report = ReportModel()
            let openReports = []
            for (let report_full_id of reportFullIds) {
              // 最初と最後だけ抽出
              let reports = yield Report.findAll({
                where: {
                  report_full_id
                },
                order: 'createdAt'
              })
              let first = reports[0]
              let latest = reports[reports.length - 1]
              openReports.push(first, latest)
            }
            debug('Open Reports: ', openReports.length)
            ctx.body = openReports
          })
        }
      },
      /* クローズされた通報情報 */
      [API_ROUTES.CLOSED_REPORTS]: {
        GET: (ctx) => {
          return co(function * () {
            let ClosedReport = ClosedReportModel()
            let reports = yield ClosedReport.findAll()
            ctx.body = reports
          })
        }
      },
      /* ある Actor の通報をクローズする */
      [API_ROUTES.CLOSE_REPORT]: {
        POST: (ctx) => co(function * () {
          debug(ctx.request.body)
          let {actor_key, closed_date} = ctx.request.body
          if (!actor_key || !closed_date) {
            let message = `Invalid body. actor_key: ${actor_key}, closed_date: ${closed_date}`
            debug(message)
            ctx.status = 400
            ctx.body = {
              success: false,
              message
            }
            return
          }
          // Open な通報の full ID を取得
          let OpenReport = OpenReportModel()
          let opens = yield OpenReport.findAll({
            where: {
              actor_key
            }
          })
          let fullIds = opens.map((report) => report.report_full_id)
          let Report = ReportModel()
          let ClosedReport = ClosedReportModel()
          for (let report_full_id of fullIds) {
            let firstReport = yield Report.findOne({
              where: {
                report_full_id,
                event: 'emergency'
              },
              order: 'createdAt'
            })
            yield ClosedReport.create({
              report_full_id,
              actor_key: commonFunc.toActorKey(report_full_id),
              report_id: commonFunc.toReportId(report_full_id),
              first_report_date: new Date(firstReport.dataValues.date),
              closed_date: new Date(closed_date)
            })
          }
          yield OpenReport.destroy({
            where: {
              report_full_id: {
                $in: fullIds
              }
            }
          })
          ctx.body = {
            success: true
          }
        })
      },
      /* 本部の位置 */
      [API_ROUTES.CENTER_LOCATION]: {
        GET: (ctx) => {
          ctx.body = centerLocation
        },
        POST: (ctx) => {
          let location = ctx.request.body
          // TODO validation
          centerLocation = location
          ctx.body = {
            success: true
          }
        }
      }
    },
    middlewares: [
      logger
    ],
    storage: {
      redis: {
        url: env.redis.URL,
        db: 1
      }
    }
  })
  yield server.listen(env.port.SERVER)
  yield observe()
}).catch(err => console.error(err))
