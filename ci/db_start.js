#!/usr/bin/env node
/**
 * Start database Docker contaier
 */

const { execSync } = require('child_process')
const { db } = require('../env')
const {
  DB_DOCKER_CONTAINER_NAME
} = db

let cmd = `

docker start ${DB_DOCKER_CONTAINER_NAME}

`.trim()

console.log('> ' + cmd)

execSync(cmd, {
  stdio: 'inherit'
})
