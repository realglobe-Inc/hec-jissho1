import React, {PropTypes as types} from 'react'
import {connect} from 'react-redux'
import c from 'classnames'
import {ApButton} from 'apeman-react-button'
import actions from '../actions'
import appUtil from '../utils/app_util'

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
    appUtil.closeReports()
    this.props.dispatch(actions.toggleModal('confirmClosingReports'))
  },

  no () {
    this.props.dispatch(actions.toggleModal('confirmClosingReports'))
  }
})

const mapStateToProps = (state, ownProp) => {
  let display = state.modalWindow.confirmClosingReports
  return {
    display
  }
}

const mapDispatchToProps = (dispatch) => ({ dispatch })

ConfirmCloseReportWindow = connect(mapStateToProps, mapDispatchToProps)(ConfirmCloseReportWindow)

export default ConfirmCloseReportWindow
