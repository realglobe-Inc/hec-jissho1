import React from 'react'
import {connect} from 'react-redux'
import storeUtil from '../utils/store_util'
import appUtil from '../utils/app_util'

const debug = require('debug')('hec:ControllerPanelArea')

const ReportWatch = React.createClass({
  getInitialState () {
    return {
      /* start からの経過秒数 */
      ms: new Date() - this.props.start
    }
  },
  render () {
    const s = this
    let {ms} = s.state
    let padding = number => ('0' + number).slice(-2)
    let seconds = Math.floor(ms / 1000)
    let hours = Math.floor(seconds / 3600)
    seconds %= 3600
    let minutes = Math.floor(seconds / 60)
    seconds %= 60
    return (
      <div className='report-watch'>
       {hours} 時間 {padding(minutes)} 分 {padding(seconds)} 秒
      </div>
    )
  },
  componentDidMount () {
    const s = this
    s.timer = setInterval(() => {
      this.setState({ms: new Date() - s.props.start})
    }, 1000)
  },

  componentWillUnmount () {
    const s = this
    clearInterval(s.timer)
  }
})

let ControllerPanelArea = React.createClass({
  propTypes: {
    content: React.PropTypes.object
  },

  render () {
    const s = this
    let {props} = s
    let {content} = props
    return (
      <div className='controller-panel-area'>
        <div className='title'>
          通報情報
        </div>
        <div className='content'>
          {content}
        </div>
      </div>
    )
  }
})

const mapStateToProps = (state, ownProp) => {
  // この実証実験では常に通報情報詳細を表示する
  let has = storeUtil.hasReport(state)
  if (!has) {
    return { content: <div><h4>通報はありません</h4></div> }
  } else {
    let latest = storeUtil.getLatestReport(state)
    let first = storeUtil.getFirstReport(state)
    return { content: (
      <div className='area-report'>
        <h4>通報あり</h4>
        <div className='report-watch-wrapper'>
          <div>
            通報からの経過時間
          </div>
          <ReportWatch start={first.date}/>
        </div>
        <div className='info'>
          心拍数: {latest.heartRate}
        </div>
        <div className='info'>
          通報時刻: {appUtil.formatTime(first.date)}
        </div>
      </div>
    ) }
  }
}

ControllerPanelArea = connect(mapStateToProps)(ControllerPanelArea)

export default ControllerPanelArea
