#!/usr/bin/env node

const sugoHub = require('sugo-hub')
const logger = require('koa-logger')()
const ReportModel = require('../db/report_model')
const OpenReportModel = require('../db/open_report_model')
const ClosedReportModel = require('../db/closed_report_model')
const co = require('co')
const env = require('../env')

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
      ['/reports']: {
        GET: (ctx) => {
          return co(function * () {
            let OpenReport = OpenReportModel()
            let reportIds = yield OpenReport.findAll()
            if (reportIds.length === 0) {
              ctx.body = []
              return
            }
            reportIds = reportIds.map(({report_id}) => report_id)
            debug('report IDs: ', reportIds)
            let Report = ReportModel()
            // TODO 通報は最初と最新だけを取ってくればいいはず
            let reports = yield Report.findAll({
              where: {
                report_id: {
                  $in: reportIds
                }
              }
            })
            debug('Reports: ', reports.length)
            ctx.body = reports
          })
        }
      },
      /* 通報をクローズする */
      ['/close_report']: {
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
          // actorKey から report_id を復元する
          // 一つの actorKey に対しオープンな通報は高々一つであるように実装されている
          let OpenReport = OpenReportModel()
          let reportData = yield OpenReport.findOne({
            where: {
              report_id: {
                $like: `${actor_key}%`
              }
            }
          })
          let {report_id} = reportData.dataValues
          // DB 操作
          yield OpenReport.destroy({
            where: {
              report_id
            }
          })
          yield ClosedReportModel().create({
            report_id,
            closed_date
          })
          ctx.body = {
            success: true,
            report_id
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
