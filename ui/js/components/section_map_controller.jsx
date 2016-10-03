/**
 * Map controller section
 */
import React from 'react'
import ControllerHeader from './controller_header'
import ControllerBody from './controller_body'

const SectionMapController = React.createClass({
  render () {
    return (
      <div className='section-map-controller-wrapper'>
        <div className='section-map-controller'>
          <ControllerHeader />
          <ControllerBody />
        </div>
      </div>
    )
  }
})

export default SectionMapController
