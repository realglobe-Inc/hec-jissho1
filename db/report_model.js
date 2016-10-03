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
    /* 緯度 */
    lat: {
      type: Sequelize.DOUBLE(9, 6)
    },
    /* 経度 */
    lng: {
      type: Sequelize.DOUBLE(9, 6)
    },
    /* イベント名 warning | emergency */
    event: {
      type: Sequelize.STRING
    },
    /* 心拍数 */
    heartRate: {
      type: Sequelize.INTEGER
    },
    /* 通報のあった日時 */
    date: {
      type: Sequelize.STRING
    }
  }, {
    freezeTableName: true
  })

  return model
}

module.exports = ReportModel
