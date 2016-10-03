/**
 * Get configurations
 * @function configs
 * @returns {Object}
 */
'use strict'

const { nameColorizer } = require('apemancolor/lib/colorizers')
let color = nameColorizer('#3A8')('hec-jissho1')

module.exports = {
  color, // rgba(50, 169, 123, 1)
  apiKey: 'AIzaSyBiVMLPxmXQU7B4I3Txb1zffguybZ7HLD0',
  mapCenter: {lat: 35.701667, lng: 139.753160}
}
