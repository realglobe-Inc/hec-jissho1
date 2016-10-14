/**
 * majika 設定ファイル
 */
'use strict'
const pkg = require('./package.json')

const common = {
  makeNpmrc: [
    'echo "registry = https://realglobe.artifactoryonline.com/realglobe/api/npm/npm-virtual" > .npmrc',
    'curl -u`sugos-secrets get -r jfrog:deployer:username`:`sugos-secrets get -r jfrog:deployer:password` "https://realglobe.artifactoryonline.com/realglobe/api/npm/auth" >> .npmrc'
  ],
  makeNpmrcDocker: [
    // sugos-secrets を直接使えないのが悩ましい
    'echo "registry = https://realglobe.artifactoryonline.com/realglobe/api/npm/npm-virtual" > .npmrc',
    'curl -u${NPM_USER}:${NPM_PASSWORD} "https://realglobe.artifactoryonline.com/realglobe/api/npm/auth" >> .npmrc'
  ],
  buildScript: [
    './ci/compile.js',
    'rm .npmrc'
  ]
}

module.exports = {
  heroku: {
    preDeploy: common.makeNpmrc,
    env: {
      NODE_ENV: {
        value: 'production'
      },
      DEBUG: {
        value: 'sg:*,hec:*,socket.io:*'
      },
      HEROKU: {
        value: 'true'
      },
      HUB_URL: {
        value: `https://${pkg.name}.herokuapp.com`
      }
    },
    addons: [
      'heroku-redis:hobby-dev',
      'cleardb:ignite'
    ]
  },
  dockerRepositoryPrefix: 'realglobe-docker-virtual.jfrog.io/',
  dockerBuildArgs: {
    additionalOptions: ['--force-rm=true', '--no-cache=true']
  }
}
