import React from 'react'
import ReactDOM from 'react-dom'
import co from 'co'
import auth from '../auth'
import Header from '../components/header'

const App = (props) => {
  return (
    <div className='app'>
      <Header/>
      <div className='body'>
        設定画面
      </div>
    </div>
  )
}

co(function * () {
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
