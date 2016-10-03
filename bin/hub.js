#!/usr/bin/env node

const sugoHub = require('sugo-hub')
const ReportModel = require('../db/report_model')
const co = require('co')
const env = require('../env')

console.log(`
NODE_ENV: ${process.env.NODE_ENV}
PORT: ${env.port.SERVER}
REDIS_URL: ${env.redis.URL}
`)

co(function * () {
  let server = sugoHub({
    public: [ 'public' ],
    endpoints: {
      ['/reports']: {
        GET: (ctx) => {
          return co(function * () {
            let Report = ReportModel()
            let data = yield Report.findAll()
            ctx.body = data
          })
        }
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
