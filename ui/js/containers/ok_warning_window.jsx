import React, {PropTypes as types} from 'react'
import reactUtil from '../utils/react_util'
import c from 'classnames'
import {ApButton} from 'apeman-react-button'
import actions from '../actions'
import {MODAL} from '../constants'

const debug = require('debug')('hec:OkWarningWindow')

const OkWarningWindow = reactUtil.createReduxClass({
  render () {
    const s = this
    let show = s.shouldShow(s.props.storeState)
    return (
      <div className={c('modal-window-background-nobg', show ? '' : 'hidden')}>
        <div className={show ? 'warning-display' : ''}></div>
        <div className='confirm-close-report'>
          <div className='message red'>
            通報が来ました！
          </div>
          <div className='buttons'>
            <ApButton onTap={s.stop}>閉じる</ApButton>
          </div>
        </div>
      </div>
    )
  },

  componentDidUpdate (prevProps) {
    const s = this
    let appear = !s.shouldShow(prevProps.storeState) && s.shouldShow(s.props.storeState)
    if (appear) {
      document.addEventListener('keydown', s.detectEnter)
      return
    }
  },

  detectEnter (e) {
    const ENTER = 13
    if (e.keyCode === ENTER) {
      this.stop()
    }
  },

  stop () {
    const s = this
    document.removeEventListener('keydown', s.detectEnter)
    s.props.dispatch(actions.toggleModal(MODAL.OK_WARNING))
  },

  shouldShow (storeState) {
    return storeState.modalWindow[MODAL.OK_WARNING]
  }
})

export default OkWarningWindow
