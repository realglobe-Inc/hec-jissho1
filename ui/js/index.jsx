import React from 'react'
import ReactDOM from 'react-dom'
import co from 'co'
import App from './components/app'
import { Provider } from 'react-redux'
import { color } from '../config'
import actions from './actions'
import store from './store'
import callerManager from './utils/caller_manager'
import auth from './auth'

const debug = require('debug')('sg:site:index')
co(function * () {
  debug(`NODE_ENV = ${process.env.NODE_ENV}`)

  if (!auth(window.prompt, window.localStorage)) {
    return
  }

  const rootEl = document.getElementById('site')
  function render () {
    ReactDOM.render(
      <Provider store={ store }>
      <App color={ color }/>
      </Provider>,
      rootEl
    )
  }
  document.addEventListener('DOMContentLoaded', render)

  // Store 初期化等
  store.dispatch(actions.dominantColor({ color }))
  yield store.dispatch(actions.fetchAllReports())
  yield callerManager.connectCallers()
  yield callerManager.observeActors()
  store.initializeMarkers()
})
