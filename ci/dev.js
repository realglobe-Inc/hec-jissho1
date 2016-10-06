#!/usr/bin/env node
'use strict'

process.env.DEBUG = 'sg:*'
process.chdir(`${__dirname}/..`)

const co = require('co')
const asleep = require('asleep')
const { spawn } = require('child_process')
const { devServer } = require('sugo-ci-site')
const { port } = require('../env')
const ip = require('ip')
const observe = require('../bin/observer.js')

const HOST = process.env.HOST || ip.address()
process.env.HUB_URL = `http://${HOST}:${port.SERVER}`

function spawnWithEnv (command) {
  console.log(`> ${command}`)
  let child = spawn(command, [], {
    stdio: 'inherit',
    env: Object.assign({}, process.env, {
      NODE_ENV: 'development',
      DEBUG: 'sg:*,hec:*',
      HOSTNAME: `${HOST}:${port.SERVER}`,
      HUB_URL: `http://${HOST}:${port.SERVER}`
    })
  })
  child.on('error', (err) => console.error(err))
  return child
}

function spawnPromise (command) {
  return new Promise((resolve, reject) => {
    console.log(`> ${command}`)
    let child = spawn(command, [], { stdio: 'inherit' })
    child.on('error', (err) => reject(err))
    child.on('close', () => resolve())
  })
}

process.on('SIGINT', () => {
  return co(function * () {
    yield spawnPromise('./ci/db_stop.js')
    process.exit()
  })
})

co(function * () {
  yield spawnPromise('./ci/db_start.js')
  yield asleep(1000)
  yield spawnPromise('./ci/db_sync.js')
  spawnWithEnv('redis-server')
  yield asleep(1000)
  spawnWithEnv('./bin/hub.js')
  yield asleep(1000)
  devServer({ host: HOST, port, dir: process.cwd() })
  yield asleep(1000)
  yield observe()
}).catch((err) => console.error(err))
