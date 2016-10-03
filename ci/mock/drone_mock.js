const { EventEmitter } = require('events')
const debug = require('debug')('hec:drone-mock')

/**
 * lat: 緯度
 * lng: 経度
 * direction: 向き。北をy軸正方向、東をx軸正方向としたときの原点とのなす角をラジアン(-PI <= d <= PI)で表したもの
 * name: ドローンの名前
 */
class Drone extends EventEmitter {
  constructor ({lat, lng, direction = 0, name}) {
    super()
    const s = this
    Object.assign(s, {lat, lng, name})
    s._movingInterval = null
    s.on('location', (location) => {
      debug(location)
    })
    s.on('start', () => {
      debug('start')
    })
    s.on('finish', () => {
      debug('finish')
    })
    s.on('abort', () => {
      debug('abort')
    })
  }

  moveTo ({lat: toLat, lng: toLng}) {
    const s = this
    s.emit('start')
    let step = 20
    let {lat, lng} = s.getLocation()
    let stepLat = (toLat - lat) / step
    let stepLng = (toLng - lng) / step
    s.direction = Math.atan2(toLat - lat, toLng - lng)
    let count = 0
    s._movingInterval = setInterval(() => {
      count++
      s.lat = lat + stepLat * count
      s.lng = lng + stepLng * count
      s.emit('location', s.getLocation())
      if (count === 20) {
        clearInterval(s._movingInterval)
        s._movingInterval = null
        s.emit('finish')
      }
    }, 300)
  }

  abortMoving () {
    const s = this
    if (s._movingInterval) {
      clearInterval(s._movingInterval)
      s._movingInterval = null
      s.emit('abort')
    }
  }

  getLocation () {
    let {lat, lng, direction} = this
    return {lat, lng, direction}
  }
}

// let drone = new Drone({lat: 10, lng: 5, name: 'hoge'})
// setTimeout(() => {
//   drone.moveTo({lat: 12, lng: 2})
// }, 2000)
// setTimeout(() => {
//   drone.stop()
// }, 6000)

module.exports = Drone
