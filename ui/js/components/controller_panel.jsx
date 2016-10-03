/**
 * Controller panel
 */
import React from 'react'
import ControllerPanelArea from '../containers/controller_panel_area'
import ControllerPanelSelect from '../containers/controller_panel_select'

const debug = require('debug')('hec:ControllerPanel')

const ControllerPanel = React.createClass({
  render () {
    return (
      <div className='controller-panel'>
        <ControllerPanelSelect/>
        <ControllerPanelArea/>
      </div>
    )
  }
})

export default ControllerPanel
