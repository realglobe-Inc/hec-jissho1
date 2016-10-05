/**
 * Controller panel
 */
import React from 'react'
import ControllerPanelArea from '../containers/controller_panel_area'
import ControllerPanelSelect from '../containers/controller_panel_select'
import c from 'classnames'
import appUtil from '../utils/app_util'

const debug = require('debug')('hec:ControllerPanel')

const ControllerPanel = React.createClass({
  getInitialState () {
    return {
      display: !appUtil.isSmartPhone()
    }
  },

  render () {
    const s = this
    let {display} = s.state
    let width = 400 // See controller-panel.scss $panel-width
    let displayStyle = display ? {} : {left: `-${width}px`}
    return (
      <div className='controller-panel' style={displayStyle}>
        <div className='panel-display-toggle' onClick={s.toggleDisplay}>
          <i className={c('fa', 'fa-3x', display ? 'fa-caret-left' : 'fa-caret-right')} aria-hidden></i>
          <div className='expand' onClick={s.toggleDisplay}></div>
        </div>
        <ControllerPanelSelect/>
        <ControllerPanelArea/>
      </div>
    )
  },

  toggleDisplay () {
    debug('toggle', this.state.display)
    this.setState({display: !this.state.display})
  }
})

export default ControllerPanel
