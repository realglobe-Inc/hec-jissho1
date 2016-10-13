import React from 'react'
import ReactDOM from 'react-dom'
import co from 'co'
import auth from '../auth'
import request from 'browser-request'
import Header from '../components/header'
import AppStyle from '../components/app_style'
import {ApButton} from 'apeman-react-button'

const App = React.createClass({
  getInitialState () {
    return {
      centerLocation: {
        lat: 0,
        lng: 0
      }
    }
  },

  // ref
  _inputLat: null,
  _inputLng: null,

  render () {
    const s = this
    let {lat, lng} = s.state.centerLocation
    return (
      <div className='app'>
        <AppStyle/>
        <Header/>
        <div className='config'>
          <h2 className='title'>本部の位置変更</h2>
          <div className='config-center-location'>
            <form>
              <h3>現在の位置</h3>
              <div className='item'>
                経度(lat): {lat}
              </div>
              <div className='item'>
                緯度(lng): {lng}
              </div>
              <h3>変更</h3>
              <div className='item'>
                緯度(lat): <input type='text' ref={(input) => s._inputLat = input}/>
              </div>
              <div className='item'>
                経度(lng): <input type='text' ref={(input) => s._inputLng = input}/>
              </div>
              <div className='submit'>
                <ApButton onTap={this.changeCenterLocation}>変更</ApButton>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  },

  componentDidMount () {
    const s = this
    request({
      url: '/center_location',
      method: 'GET',
      json: true
    }, (err, resp, body) => {
      if (err) {
        throw err
      }
      s.setState({centerLocation: body})
    })
  },
  changeCenterLocation () {
    const s = this
    let lat = parseFloat(s._inputLat.value)
    let lng = parseFloat(s._inputLng.value)
    let invalid = isNaN(lat) || isNaN(lng)
    if (invalid) {
      window.alert('正しい数値を入力してください。')
      return
    }
    let centerLocation = {lat, lng}
    let confirm = window.confirm(`本部の位置を変更しますか?\n緯度:${lat}\n経度:${lng}`)
    if (!confirm) {
      return
    }
    request({
      url: '/center_location',
      method: 'POST',
      json: true,
      body: centerLocation
    }, (err, resp, body) => {
      if (err) {
        throw err
      }
      s._inputLat.value = ''
      s._inputLng.value = ''
      window.alert('変更しました。')
      s.setState({centerLocation})
    })
  }
})

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
