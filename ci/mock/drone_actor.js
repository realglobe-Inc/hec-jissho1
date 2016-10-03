#!/usr/bin/env node

process.env.DEBUG = 'sg:*,hec:*'

const HUB_URL = process.env.HUB_URL || 'http://localhost:3000'
const ACTOR_KEY = process.env.ACTOR_KEY || 'qq:drone:01'

const co = require('co')
const sugoActor = require('sugo-actor')
const DroneModule = require('./drone_module')

co(function * () {
  let drone = new DroneModule({
    lat: 35.701984,
    lng: 139.753657,
    name: 'My Drone',
    interval: 1000
  })
  let actor = sugoActor(`${HUB_URL}/actors`, {
    key: ACTOR_KEY,
    modules: {
      drone
    }
  })
  yield actor.connect()
}).catch((err) => console.error(err))
