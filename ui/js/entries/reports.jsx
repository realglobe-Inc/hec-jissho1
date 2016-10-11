import React from 'react'
import ReactDOM from 'react-dom'
import co from 'co'
import auth from '../auth'
import Header from '../components/header'
import ReportsList from '../components/reports_list'

const debug = require('debug')('sg:site:entry')

const App = (props) => {
  return (
    <div className='app'>
      <Header/>
      <div className='body'>
        <ReportsList/>
      </div>
      <div className='back-to-top'>
        <a href='/'>TOP に戻る</a>
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
