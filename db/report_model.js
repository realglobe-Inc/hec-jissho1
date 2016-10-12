/**
 * 通報情報用のデータベースのモデル
 * bin/observer が通報を受け取ってデータベースに入れる
 * ブラウザ側では初回ロード時にデータベースから通報情報を取ってくる。
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
    /* Actor key + 通報 ID */
    report_full_id: {
      type: Sequelize.STRING,
      allowNull: false
    },
    /* SUGO-Actor key */
    actor_key: {
      type: Sequelize.STRING,
      allowNull: false
    },
    /* 通報 ID */
    report_id: {
      type: Sequelize.NUMBER,
      allowNull: false
    },
    /* 緯度 */
    lat: {
      type: Sequelize.DOUBLE(9, 6),
      allowNull: false
    },
    /* 経度 */
    lng: {
      type: Sequelize.DOUBLE(9, 6),
      allowNull: false
    },
    /* イベント名 warning | emergency */
    event: {
      type: Sequelize.STRING
    },
    /* 心拍数 */
    heart_rate: {
      type: Sequelize.INTEGER
    },
    /* 通報のデータを日時 RFC 文字列 */
    date: {
      type: Sequelize.STRING,
      allowNull: false
    }
  }, {
    freezeTableName: true
  })

  return model
}

module.exports = ReportModel
