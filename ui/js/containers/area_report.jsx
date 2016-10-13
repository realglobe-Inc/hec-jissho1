import React, {PropTypes as types} from 'react'
import reactUtil from '../utils/react_util'
import storeUtil from '../utils/store_util'
import appUtil from '../utils/app_util'
import {ApButton} from 'apeman-react-button'
import actions from '../actions'
import {MODAL} from '../constants'

const debug = require('debug')('hec:AreaReport')

const ReportWatch = React.createClass({
  propTypes: {
    /* 最初の通報時刻。 Date オブジェクト */
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

  timer: null,

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

const AreaReport = reactUtil.createReduxClass({
  render () {
    const s = this
    let state = s.props.storeState
    let actorKey = state.selectedMarkerKey
    let marker = storeUtil.getSelectedMarker(state)
    let latest = storeUtil.getLatestReport({state, actorKey})
    let first = storeUtil.getFirstReport({state, actorKey})
    return (
      <div className='area-report'>
        <h4>{marker ? marker.name : '通報'}</h4>
        <div className='info'>
          <div className='name'>
            住所
          </div>
          <div className='value'>
            {marker ? marker.address : ''}
          </div>
        </div>
        <div className='info'>
          <div className='name'>
            通報からの経過時間
          </div>
          <div className='value'>
            <ReportWatch start={first.date}/>
          </div>
        </div>
        <div className='info'>
          <div className='name'>
            通報日時
          </div>
          <div className='value'>
            {appUtil.formatTime(first.date, { type: 'full_jp' })}
          </div>
        </div>
        <div className='info'>
          {/* FIXME This is ハリボテ */}
          <div className='name'>
            理由
          </div>
          <div className='value'>
            心肺停止
          </div>
        </div>
        <div className='info'>
          <div className='name'>
            心拍数
          </div>
          <div className='value'>
            {latest.heartRate}
          </div>
        </div>

        {s.renderCloseButton()}
      </div>
    )
  },

  renderCloseButton () {
    return (
      <div className='close-report'>
        <ApButton
          primary wide danger style={{border: '0 solid'}}
          onTap={this.showConfirmWindow}
          >
          通報をクローズする
        </ApButton>
      </div>
    )
  },

  /**
   * 通報クローズの確認画面
   */
  showConfirmWindow () {
    this.props.dispatch(actions.toggleModal(MODAL.CONFIRM_CLOSE))
  }
})

export default AreaReport
