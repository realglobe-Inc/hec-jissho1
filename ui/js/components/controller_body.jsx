/**
 * Map controller body
 */
import React from 'react'
import ControllerMap from '../containers/controller_map'
import ControllerPanel from '../containers/controller_panel'

const ControllerBody = React.createClass({
  render () {
    return (
      <div className='controller-body'>
        <ControllerPanel />
        <ControllerMap />
      </div>
    )
  }
})

export default ControllerBody
