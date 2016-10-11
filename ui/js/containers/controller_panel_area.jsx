import React, { PropTypes as types } from 'react'
import {connect} from 'react-redux'
import storeUtil from '../utils/store_util'
import appUtil from '../utils/app_util'
import {ApButton} from 'apeman-react-button'
import actions from '../actions'
import {HITOE_ACTORKEY_PREFIX, MODAL} from '../constants'

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
          {s.renderSelectedReport()}
        </div>
      </div>
    )
  },

  renderSelectedReport () {
    const s = this
    let state = s.props.storeState
    let { selectedMarkerKey } = state
    let isReportSelected = selectedMarkerKey.startsWith(HITOE_ACTORKEY_PREFIX)
    if (!isReportSelected) {
      return <div></div>
    }
    let actorKey = selectedMarkerKey
    let has = storeUtil.hasOpenReport({state, actorKey})
    if (!has) {
      return (
        <div><h4>通報はありません</h4></div>
      )
    }
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
            通報時刻
          </div>
          <div className='value'>
            {appUtil.formatTime(first.date)}
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

const mapStateToProps = (storeState) => ({ storeState })
const mapDispatchToProps = (dispatch) => ({ dispatch })

ControllerPanelArea = connect(mapStateToProps, mapDispatchToProps)(ControllerPanelArea)

export default ControllerPanelArea
