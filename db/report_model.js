/**
 * 通報情報用のデータベースのモデル
 */
const Sequelize = require('sequelize')
const { db } = require('../env')
const { DB_URL } = db
const debug = require('debug')('sg:db:Report')

const { HEROKU } = process.env

function ReportModel () {
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

  let model = sequelize.define('report', {
    /* デバイスの識別子 */
    device_id: {
      type: Sequelize.STRING
    },
    /* デバイスの名前 */
    device_name: {
      type: Sequelize.STRING
    },
    /* 通報の識別子。同一IDから複数の通報があり得る */
    report_id: {
      type: Sequelize.STRING
    },
    /* 緯度 */
    lat: {
      type: Sequelize.DOUBLE(9, 6)
    },
    /* 経度 */
    lng: {
      type: Sequelize.DOUBLE(9, 6)
    },
    /* 付加情報 */
    info: {
      type: Sequelize.STRING(500)
    },
    /* 通報のあった日時 */
    date: {
      type: Sequelize.DATE
    }
  }, {
    freezeTableName: true
  })

  return model
}

module.exports = ReportModel
