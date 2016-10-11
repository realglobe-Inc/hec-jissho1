import React from 'react'
import ReactDOM from 'react-dom'
import co from 'co'
import auth from '../auth'
import Header from '../components/header'

const debug = require('debug')('sg:site:entry')

const App = (props) => {
  return (
    <div className='app'>
      <Header/>
      <div className='menu-wrapper'>
        <div className='menu-button'>
        <a href='system.html'>システム画面</a>
        </div>
        <div className='menu-button'>
        <a href='reports.html'>対応済み通報一覧</a>
        </div>
      </div>
    </div>
  )
}

co(function * () {
  debug(`NODE_ENV = ${process.env.NODE_ENV}`)

  if (!auth(window.prompt, window.localStorage)) {
    return
  }

  const rootEl = document.getElementById('site')
  function render () {
    ReactDOM.render(
      <App/>,
      rootEl
    )
  }
  document.addEventListener('DOMContentLoaded', render)
})
