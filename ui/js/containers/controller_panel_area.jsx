import React, { PropTypes as types } from 'react'
import {connect} from 'react-redux'
import storeUtil from '../utils/store_util'
import appUtil from '../utils/app_util'
import {ApButton} from 'apeman-react-button'
import actions from '../actions'

const debug = require('debug')('hec:ControllerPanelArea')

const ReportWatch = React.createClass({
  propTypes: {
    start: types.object
  },
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
    storeState: types.object,
    dispatch: types.func
  },

  render () {
    const s = this
    return (
      <div className='controller-panel-area'>
        <div className='title'>
          通報情報
        </div>
        <div className='content'>
          {s.renderReportContent()}
        </div>
      </div>
    )
  },

  renderReportContent () {
    const s = this
    let { storeState } = s.props
    // この実証実験では常に通報情報詳細を表示する
    let has = storeUtil.hasReport(storeState)
    if (!has) {
      return (
        <div><h4>通報はありません</h4></div>
      )
    } else {
      let latest = storeUtil.getLatestReport(storeState)
      let first = storeUtil.getFirstReport(storeState)
      return (
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

          <div className='close-report'>
            <ApButton
              primary wide danger style={{border: '0 solid'}}
              onTap={s.showConfirmWindow}
              >
              通報をクローズする
            </ApButton>
          </div>
        </div>
      )
    }
  },

  /**
   * 通報クローズの確認画面
   */
  showConfirmWindow () {
    this.props.dispatch(actions.toggleModal('confirmClosingReports'))
  }
})

const mapStateToProps = (storeState) => ({ storeState })
const mapDispatchToProps = (dispatch) => ({ dispatch })

ControllerPanelArea = connect(mapStateToProps, mapDispatchToProps)(ControllerPanelArea)

export default ControllerPanelArea
