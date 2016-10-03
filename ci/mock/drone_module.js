const { Module } = require('sugo-module-base')
const co = require('co')
const { hasBin } = require('sg-check')
const debug = require('debug')('sugo:module:mock-drone')
const Drone = require('./drone_mock')

const name = 'mock-drone-module'
const version = '1.0.0'
const description = 'Drone'

/** @lends DroneModule */
class DroneModule extends Module {
  constructor (config = {}) {
    debug('Config: ', config)
    super(config)
    const s = this
    s._drone = new Drone(config)
    s._drone.on('location', (location) => {
      s.emit('location', location)
    })
    s._drone.on('start', () => {
      s.emit('start')
    })
    s._drone.on('finish', () => {
      s.emit('finish')
    })
    s._drone.on('abort', () => {
      s.emit('abort')
    })
  }

  /**
   * Ping a message.
   * @param {string} pong - Pong message
   * @returns {Promise.<string>} - Pong message
   */
  ping (pong = 'pong') {
    return co(function * () {
      return pong
    })
  }

  /**
   * Assert actor system requirements.
   * @throws {Error} - System requirements failed error
   * @returns {Promise.<boolean>} - Asserted state
   */
  assert () {
    const bins = [ 'node' ] // Required commands
    return co(function * assertAck () {
      yield hasBin.assertAll(bins)
      return true
    })
  }

  info () {
    return {
      type: 'drone',
      name: this._drone.name,
      dynamic: true
    }
  }

  /**
   * Move to a location
   */
  moveTo (location) {
    this._drone.moveTo(location)
  }

  /**
   * Abort moving
   */
  abortMoving () {
    this._drone.abortMoving()
  }

  /**
   * Get drone location
   */
  getLocation () {
    return this._drone.getLocation()
  }

  /**
   * Module specification
   * @see https://github.com/realglobe-Inc/sg-schemas/blob/master/lib/module_spec.json
   */
  get $spec () {
    return {
      name,
      version,
      desc: description,
      methods: {

        ping: {
          desc: 'Test the reachability of an module.',
          params: [
            { name: 'pong', type: 'string', desc: 'Pong message to return' }
          ],
          return: {
            type: 'string',
            desc: 'Pong message'
          }
        },

        assert: {
          desc: 'Test if the actor fulfills system requirements',
          params: [],
          throws: [ {
            type: 'Error',
            desc: 'System requirements failed'
          } ],
          return: {
            type: 'boolean',
            desc: 'System is OK'
          }
        },

        info: {
          desc: 'information',
          params: [],
          return: {
            type: 'object',
            desc: 'information'
          }
        },

        moveTo: {
          desc: 'Move to a location',
          params: [
            { name: 'location', type: 'object', desc: '{lat, lng}' }
          ],
          return: {}
        },

        abortMoving: {
          desc: 'Abort moving',
          params: [],
          return: {}
        },

        getLocation: {
          desc: 'Get drone location',
          params: [],
          return: {
            type: 'object',
            desc: 'location'
          }
        }
      },
      events: {
        location: { desc: 'Chage the location {lat, lng}' },
        start: {desc: 'Start moving'},
        finish: {desc: 'Finish moving'},
        abort: {desc: 'Abort moving'}
      }
    }
  }
}

module.exports = DroneModule

/**
 * @property {Array} params - Invoke parameters.
 * @property {EventEmitter} pipe - Pipe to remote caller.
 */
