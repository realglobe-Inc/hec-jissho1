const { Module } = require('sugo-module-base')
const co = require('co')
const { hasBin } = require('sg-check')
const debug = require('debug')('sugo:module:mock-android')
const Android = require('./android_mock')

const name = 'mock-android-module'
const version = '1.0.0'
const description = 'Android'

/** @lends AndroidModule */
class AndroidModule extends Module {
  constructor (config = {}) {
    debug('Config: ', config)
    super(config)
    const s = this
    s._android = new Android(config)
    s._android.on('report', () => {
      s.emit('report')
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
      type: 'android',
      name: this._android.name,
      dynamic: true
    }
  }

  /**
   * Get drone location
   */
  getLocation () {
    return this._android.getLocation()
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

        getLocation: {
          desc: 'Get android location',
          params: [],
          return: {
            type: 'object',
            desc: 'location'
          }
        }
      },
      events: {
        report: {desc: 'Report'}
      }
    }
  }
}

module.exports = AndroidModule

/**
 * @property {Array} params - Invoke parameters.
 * @property {EventEmitter} pipe - Pipe to remote caller.
 */
