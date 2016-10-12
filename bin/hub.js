#!/usr/bin/env node

const sugoHub = require('sugo-hub')
const logger = require('koa-logger')()
const ReportModel = require('../db/report_model')
const OpenReportModel = require('../db/open_report_model')
const ClosedReportModel = require('../db/closed_report_model')
const co = require('co')
const env = require('../env')
const commonFunc = require('../lib/common_func')

const debug = require('debug')('hec:hub')

console.log(`
NODE_ENV: ${process.env.NODE_ENV}
PORT: ${env.port.SERVER}
REDIS_URL: ${env.redis.URL}
`)

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
      /* 通報をクローズする */
      ['/api/close_report']: {
        POST: (ctx) => co(function * () {
          debug(ctx.request.body)
          let {report_full_id, closed_date} = ctx.request.body
          if (!report_full_id || !closed_date) {
            let message = `Invalid body. report_full_id: ${report_full_id}, closed_date: ${closed_date}`
            debug(message)
            ctx.status = 400
            ctx.body = {
              success: false,
              message
            }
            return
          }
          // DB 操作
          let firstReport = yield ReportModel().findOne({
            where: {
              report_full_id,
              event: 'emergency'
            },
            order: 'createdAt'
          })
          yield ClosedReportModel().create({
            report_full_id,
            actor_key: commonFunc.toActorKey(report_full_id),
            report_id: commonFunc.toReportId(report_full_id),
            first_report_date: new Date(firstReport.dataValues.date),
            closed_date: new Date(closed_date)
          })
          let OpenReport = OpenReportModel()
          yield OpenReport.destroy({
            where: {
              report_full_id
            }
          })
          ctx.body = {
            success: true
          }
        })
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
