import React from 'react'
import ReactDOM from 'react-dom'
import co from 'co'
import auth from '../auth'
import Header from '../components/header'

const debug = require('debug')('sg:site:entry')

const App = (props) => {
  let links = [
    {
      url: 'system.html',
      text: 'システム画面'
    },
    {
      url: 'reports.html',
      text: '対応済み通報一覧'
    },
    {
      url: 'config.html',
      text: '設定'
    }
  ]
  return (
    <div className='app'>
      <Header/>
      <div className='menu-wrapper'>
        {
          links.map((link) => (
            <div className='menu-button' key={link.url}>
              <a href={link.url}>{link.text}</a>
            </div>
          ))
        }
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
