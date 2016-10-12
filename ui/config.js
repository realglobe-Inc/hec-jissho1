/**
 * Get configurations
 * @function configs
 * @returns {Object}
 */
'use strict'
const cssVars = require('./scss/vars.json')

module.exports = {
  /* テーマカラー */
  color: cssVars['app-color'],
  /* Google Map API Key */
  apiKey: 'AIzaSyBiVMLPxmXQU7B4I3Txb1zffguybZ7HLD0',
  /* 地図の中心かつ救急センターの位置 */
  mapCenter: {
    lat: 35.701562,
    lng: 139.753148
  }
}
