const { Module } = require('sugo-module-base')
const co = require('co')
const { hasBin } = require('sg-check')
const debug = require('debug')('sugo:module:mock-hitoe')
const Hitoe = require('./hitoe_mock')

const name = 'mock-android-module'
const version = '1.0.0'
const description = 'Hitoe'

/** @lends HitoeModule */
class HitoeModule extends Module {
  constructor (config = {}) {
    debug('Config: ', config)
    super(config)
    const s = this
    s._hitoe = new Hitoe(config)
    s._hitoe.on('warning', (data) => {
      s.emit('warning', data)
    })
    s._hitoe.on('emergency', (data) => {
      s.emit('emergency', data)
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

  emitWarning (data) {
    this._hitoe.emit('warning', data)
  }

  emitEmergency (data) {
    this._hitoe.emit('emergency', data)
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
        }

        emitWarning: {
          params: []
        },
        emitEmergency: {
          params: []
        }
      },
      events: {
        warning: {desc: ''},
        emergency: {desc: ''}
      }
    }
  }
}

module.exports = HitoeModule

/**
 * @property {Array} params - Invoke parameters.
 * @property {EventEmitter} pipe - Pipe to remote caller.
 */
