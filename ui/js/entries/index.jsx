import React from 'react'
import ReactDOM from 'react-dom'
import co from 'co'
import auth from '../auth'
import Header from '../components/header'

const debug = require('debug')('sg:site:entry')

const App = (props) => {
  return (
    <div>
      <Header/>
      <div className='top-body'>
        hogehoge
        <div>
        <a href='reports.html'>reports</a>
        </div>
        <div>
        <a href='system.html'>system</a>
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
