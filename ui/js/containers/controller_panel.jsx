/**
 * Controller panel
 */
import React, {PropTypes as types} from 'react'
import reactUtil from '../utils/react_util'
import ControllerPanelArea from '../containers/controller_panel_area'
import ControllerPanelSelect from '../containers/controller_panel_select'
import actions from '../actions'
import c from 'classnames'

const debug = require('debug')('hec:ControllerPanel')

const ControllerPanel = reactUtil.createReduxClass({
  render () {
    const s = this
    let display = s.props.storeState.infoDisplay
    return (
      <div className={c('controller-panel', display ? '' : 'pannel-hidden')}>
        <div className='panel-display-toggle'>
          <i className={c('fa', 'fa-3x', display ? 'fa-caret-left' : 'fa-caret-right')} aria-hidden></i>
          <div className='expand' onClick={s.toggleDisplay}></div>
        </div>
        <ControllerPanelSelect/>
        <ControllerPanelArea/>
      </div>
    )
  },

  toggleDisplay () {
    debug('toggle')
    this.props.dispatch(actions.toggleInfoDisplay())
  }
})

export default ControllerPanel
