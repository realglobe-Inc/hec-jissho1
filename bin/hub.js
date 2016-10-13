#!/usr/bin/env node

const sugoHub = require('sugo-hub')
const logger = require('koa-logger')()
const ReportModel = require('../db/report_model')
const OpenReportModel = require('../db/open_report_model')
const ClosedReportModel = require('../db/closed_report_model')
const co = require('co')
const env = require('../env')
const commonFunc = require('../lib/common_func')
const {mapCenter} = require('../ui/config')

const debug = require('debug')('hec:hub')

console.log(`
NODE_ENV: ${process.env.NODE_ENV}
PORT: ${env.port.SERVER}
REDIS_URL: ${env.redis.URL}
`)

/** 本部の位置 ここにおくとデータを永続化できない */
let centerLocation = mapCenter

co(function * () {
  let server = sugoHub({
    public: [ 'public' ],
    endpoints: {
      /* クローズされていない通報情報 */
      ['/api/reports']: {
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
            // TODO 通報は最初と最新だけを取ってくればいいはず
            let reports = yield Report.findAll({
              where: {
                report_full_id: {
                  $in: reportFullIds
                }
              }
            })
            debug('Open Reports: ', reports.length)
            ctx.body = reports
          })
        }
      },
      /* クローズされた通報情報 */
      ['/api/closed_reports']: {
        GET: (ctx) => {
          return co(function * () {
            let ClosedReport = ClosedReportModel()
            let reports = yield ClosedReport.findAll()
            ctx.body = reports
          })
        }
      },
      /* ある Actor の通報をクローズする */
      ['/api/close_report']: {
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
      ['/center_location']: {
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
  server.listen(env.port.SERVER)
}).catch(err => console.error(err))
