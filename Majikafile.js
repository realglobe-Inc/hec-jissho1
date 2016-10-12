/**
 * majika 設定ファイル
 */
'use strict'
const pkg = require('./package.json')

const common = {
  makeNpmrc: [
    'echo "registry = https://realglobe.artifactoryonline.com/realglobe/api/npm/npm-virtual" > .npmrc',
    'curl -u`sugos-secrets get -r jfrog:deployer:username`:`sugos-secrets get -r jfrog:deployer:password` "https://realglobe.artifactoryonline.com/realglobe/api/npm/auth" >> .npmrc'
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
  }
}
