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
    /* Actor key + 通報 ID */
    report_full_id: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    },
    /* Actor key */
    actor_key: {
      type: Sequelize.NUMBER,
      allowNull: false
    },
    /* 通報 ID */
    report_id: {
      type: Sequelize.STRING,
      allowNull: false
    },
    /* 最初の通報があった日時 */
    first_report_date: {
      type: Sequelize.DATE,
      allowNull: false
    },
    /* 通報がクローズされた日時 */
    closed_date: {
      type: Sequelize.DATE,
      allowNull: false
    }
  }, {
    freezeTableName: true
  })

  return model
}

module.exports = ClosedReportModel
