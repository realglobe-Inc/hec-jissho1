/**
 * クローズされた通報
 * クローズされるまでの時間がわかるように。
 */
const Sequelize = require('sequelize')
const { db } = require('../env')
const { DB_URL } = db
const debug = require('debug')('sg:db:ClosedReport')

const { HEROKU } = process.env

function ClosedReportModel () {
  let sequelize = new Sequelize(DB_URL, {
    dialect: 'mysql',
    pool: {
      max: 3,
      min: 0,
      idle: HEROKU ? 3 : 100
    },
    logging: (data) => {
      debug(data)
    }
  })

  let model = sequelize.define('closed_report', {
    /* 通報 ID */
    report_id: {
      type: Sequelize.STRING,
      allowNull: false
    },
    /* 通報がクローズされた日時 ISO 文字列 */
    closed_date: {
      type: Sequelize.STRING,
      allowNull: false
    }
  }, {
    freezeTableName: true
  })

  return model
}

module.exports = ClosedReportModel
