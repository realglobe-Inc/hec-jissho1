/**
 * 一般的な便利関数
 */
const request = require('browser-request')

module.exports = {
  /**
   * オブジェクトのコピー
   */
  copy (obj) {
    return Object.assign({}, obj)
  },
  /**
   * Promisified request
   */
  request (arg) {
    return new Promise((resolve, reject) => {
      request(arg, (err, res, body) => {
        err ? reject(err) : resolve(body)
      })
    })
  }
}
