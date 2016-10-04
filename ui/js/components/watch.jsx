import React from 'react'
import appUtil from '../utils/app_util'

const Watch = React.createClass({
  getInitialState () {
    return {
      now: new Date()
    }
  },
  render () {
    const s = this
    let {now} = s.state
    let time = appUtil.formatTime(now)
    return (
      <div className='watch'>
      時刻 {time}
      </div>
    )
  },
  componentDidMount () {
    const s = this
    s.timer = setInterval(() => {
      this.setState({now: new Date()})
    }, 1000)
    s.setState({
      now: new Date()
    })
  },

  componentWillUnmount () {
    const s = this
    clearInterval(s.timer)
  }
})

export default Watch
