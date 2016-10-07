/**
 * Marker of marker on map
 */
import React, { PropTypes as types } from 'react'
import c from 'classnames'
import { MARKER_TYPE } from '../constants'

const debug = require('debug')('hec:components:marker_marker')
const {DRONE, REPORT} = MARKER_TYPE

let Marker = React.createClass({
  propTypes: {
    style: types.object,
    markerName: types.string,
    selected: types.bool,
    direction: types.number,
    dynamic: types.bool,
    type: types.number
  },

  render () {
    const s = this
    let {props} = s
    let {markerName, selected, type, direction, dynamic} = props
    let style = type === 'drone' ? {transform: `rotate(${Math.floor(-direction * 180 / Math.PI)}deg)`} : {}
    let icon = s.getIcon(type)
    return (
      <div className={c('map-piece', selected ? 'map-piece-selected' : '', dynamic ? 'map-piece-dynamic' : '')}>
        <i className={c('fa', 'fa-3x', icon)} aria-hidden
           style={style}
           />
          <div className='map-piece-name'>{markerName}</div>
      </div>
    )
  },

  getIcon (type) {
    switch (type) {
      case DRONE:
        return 'fa-arrow-circle-right'
      case REPORT:
        return 'fa-times'
      default:
        return 'fa-circle'
    }
  }
})

export default Marker
