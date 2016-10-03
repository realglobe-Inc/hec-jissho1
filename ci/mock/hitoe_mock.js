const { EventEmitter } = require('events')
const debug = require('debug')('hec:Hitoe-mock')

class Hitoe extends EventEmitter {
  constructor ({lat, lng, name}) {
    super()
    const s = this
    s.on('warning', (report) => {
      debug('warning', report)
    })
    s.on('emergency', (report) => {
      debug('emergency', report)
    })
  }
}

module.exports = Hitoe
