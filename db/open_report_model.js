/**
 * クローズされていない通報を持つ actor_key を管理する
 * bin/observer が最初に通報を受け取ったときにテーブルに入れる。
 * ブラウザ側から通報をクローズするとデータが消される
 */
const Sequelize = require('sequelize')
const { db } = require('../env')
const { DB_URL } = db
const debug = require('debug')('sg:db:OpenReport')

const { HEROKU } = process.env

function OpenReportModel () {
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

  let model = sequelize.define('open_report', {
    /* Actor key + 通報 ID */
    report_full_id: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    },
    /* Actor key */
    actor_key: {
      type: Sequelize.STRING
    },
    /* 通報 ID */
    report_id: {
      type: Sequelize.INTEGER
    }
  }, {
    freezeTableName: true
  })

  return model
}

module.exports = OpenReportModel
