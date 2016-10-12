import React, {PropTypes as types} from 'react'
import reactUtil from '../utils/react_util'
import c from 'classnames'
import {ApButton} from 'apeman-react-button'
import actions from '../actions'
import appUtil from '../utils/app_util'
import {MODAL} from '../constants'

const debug = require('debug')('hec:ConfirmCloseReportWindow')

const ConfirmCloseReportWindow = reactUtil.createReduxClass({
  render () {
    const s = this
    let display = s.props.storeState.modalWindow[MODAL.CONFIRM_CLOSE]
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
    let actorKey = s.props.storeState.selectedMarkerKey
    appUtil.closeReport(actorKey)
    s.closeSelf()
  },

  no () {
    const s = this
    s.closeSelf()
  },

  closeSelf () {
    this.props.dispatch(actions.toggleModal(MODAL.CONFIRM_CLOSE))
  }
})

export default ConfirmCloseReportWindow
