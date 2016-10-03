#!/usr/bin/env node
/**
 * Run database Docker contaier
 * To stop `docker stop ${DB_DOCKER_CONTAINER_NAME}`
 * To remove contaier 'docker rm CONTAINER_ID'
 * To view contaier 'docker ps'
 */

const { execSync } = require('child_process')
const { db } = require('../env')
const {
  MYSQL_DATABASE,
  MYSQL_ROOT_PASSWORD,
  DB_DOCKER_IMAGE,
  DB_DOCKER_CONTAINER_NAME,
  DB_PORT
} = db

let cmd = `

docker run -d \\
--name ${DB_DOCKER_CONTAINER_NAME} \\
-e MYSQL_DATABASE=${MYSQL_DATABASE} \\
-e MYSQL_ROOT_PASSWORD=${MYSQL_ROOT_PASSWORD} \\
-p ${DB_PORT}:3306 \\
${DB_DOCKER_IMAGE} \\
--character-set-server=utf8mb4 \\
--collation-server=utf8mb4_unicode_ci

`.trim()

console.log('> ' + cmd)

execSync(cmd, {
  stdio: 'inherit'
})
