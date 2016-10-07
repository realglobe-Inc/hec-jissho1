import React, {PropTypes as types} from 'react'
import {connect} from 'react-redux'
import c from 'classnames'
import {ApButton} from 'apeman-react-button'
import actions from '../actions'
import appUtil from '../utils/app_util'
import {MODAL} from '../constants'

const debug = require('debug')('hec:ConfirmCloseReportWindow')

let ConfirmCloseReportWindow = React.createClass({
  propTypes: {
    dispatch: types.func
  },
  render () {
    const s = this
    let {display} = s.props
    return (
      <div className={c('modal-window-background', display ? '' : 'hidden')}>
        <div className='confirm-close-report'>
          <div className='message'>
            通報をクローズしますか？
          </div>
          <div className='buttons'>
            <ApButton onTap={s.yes}>はい</ApButton>
            <ApButton onTap={s.no}>いいえ</ApButton>
          </div>
        </div>
      </div>
    )
  },

  yes () {
    const s = this
    let actorKey = s.props.selectedMarkerKey
    appUtil.closeReport(actorKey)
    this.props.dispatch(actions.toggleModal(MODAL.CONFIRM_CLOSE))
  },

  no () {
    this.props.dispatch(actions.toggleModal(MODAL.CONFIRM_CLOSE))
  }
})

const mapStateToProps = (state, ownProp) => {
  let display = state.modalWindow[MODAL.CONFIRM_CLOSE]
  let {selectedMarkerKey} = state
  return {
    display,
    selectedMarkerKey
  }
}

const mapDispatchToProps = (dispatch) => ({ dispatch })

ConfirmCloseReportWindow = connect(mapStateToProps, mapDispatchToProps)(ConfirmCloseReportWindow)

export default ConfirmCloseReportWindow
