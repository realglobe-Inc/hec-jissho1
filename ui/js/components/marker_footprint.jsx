/**
 * Marker of drone footprint on map
 */
import React from 'react'

let MarkerActor = React.createClass({
  render () {
    return (
      <div className='marker-footprint'>
        <div className='marker-footprint-content'>●</div>
      </div>
    )
  }
})

export default MarkerActor
