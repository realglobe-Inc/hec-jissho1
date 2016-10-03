#!/usr/bin/env node

process.env.DEBUG = 'sg:*'

const HUB_URL = process.env.HUB_URL || 'http://localhost:3000'
const ACTOR_KEY = process.env.ACTOR_KEY || 'control-center'

const co = require('co')
const sugoActor = require('sugo-actor')
const { Module } = sugoActor

let center = {
  key: 'control-center',
  location: {
    lat: 35.710461,
    lng: 139.764483
  },
  type: 'plain',
  dynamic: false
}

co(function * () {
  let actor = sugoActor(`${HUB_URL}/actors`, {
    key: ACTOR_KEY,
    modules: {
      hec: new Module({
        info () {
          return {
            type: 'center',
            name: 'Center',
            dynamic: false
          }
        },
        getLocation () {
          return center.location
        }
      })
    }
  })
  yield actor.connect()
}).catch(err => console.error(err))
