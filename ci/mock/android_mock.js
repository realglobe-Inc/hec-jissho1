const { EventEmitter } = require('events')
const debug = require('debug')('hec:android-mock')

class Android extends EventEmitter {
  constructor ({lat, lng, name}) {
    super()
    const s = this
    s.lat = lat
    s.lng = lng
    s.name = name
    s.on('report', (info) => {
      debug(info)
    })
  }
  /**
   * 通報する
   */
  report (info) {
    this.emit('report', info)
  }
  /**
   * 位置情報
   */
   getLocation () {
     let {lat, lng} = this
     return {lat, lng}
   }
}

module.exports = Android
