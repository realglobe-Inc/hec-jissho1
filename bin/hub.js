#!/usr/bin/env node

const sugoHub = require('sugo-hub')
const ReportModel = require('../db/report_model')
const OpenReportModel = require('../db/open_report_model')
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
      /* すべての通報をクローズする */
      ['/close_report']: {
        POST: (ctx) => co(function * () {
          let OpenReport = OpenReportModel()
          yield OpenReport.destroy({ truncate: true })
          debug('Destroyed open_report')
          ctx.body = 'ok'
        })
      }
    },
    middlewares: [],
    storage: {
      redis: {
        url: env.redis.URL,
        db: 1
      }
    }
  })
  server.listen(env.port.SERVER)
}).catch(err => console.error(err))
