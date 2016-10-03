/**
 * Controller Map
 */
import React, {PropTypes as types} from 'react'
import {connect} from 'react-redux'
import actions from '../actions'
import GoogleMap from 'google-map-react'
import Marker from '../components/marker'
import MarkerFootprint from '../components/marker_footprint'
import co from 'co'
import { apiKey } from '../../config'
import { INITIAL, PREPARING } from '../constants/drone_mode'

const debug = require('debug')('hec:ControllerMap')

const DestinationFlag = React.createClass({
  render () {
    const s = this
    return (
      <div id='mouse-flag-icon' style={s.props.style}>
        <i className='fa fa-flag fa-2x' aria-hidden='true'></i>
      </div>
    )
  }
})

let ControllerMap = React.createClass({
  propTypes: {
    dispatch: types.func,
    storeState: types.object
  },

  getInitialState () {
    return {
      destination: null
    }
  },

  render () {
    const s = this
    let {props, state} = s
    let {dispatch, storeState} = props
    let {map, droneState} = storeState
    return (
      <div className='controller-map' id='controller-map'>
        <GoogleMap center={map.center}
                   defaultZoom={17}
                   bootstrapURLKeys={{key: apiKey}}
                   onClick={droneState.mode === PREPARING ? s.putFlag : null}
                   onChildClick={s.onMarkerClick}
                   onChange={s.dispatchChangeMapCenter}
                   >
          {state.destination}
          {s.renderMarkers()}
          {s.renderDronePath()}
        </GoogleMap>
      </div>
    )
  },

  dispatchChangeMapCenter ({center}) {
    const s = this
    s.props.dispatch(actions.changeMapCenter(center))
  },

  componentWillReceiveProps (nextProps) {
    let shouldRemoveDestination = this.state.destination && nextProps.storeState.droneState.mode === INITIAL
    if (shouldRemoveDestination) {
      this.setState({ destination: null })
    }
  },

  renderMarkers () {
    const s = this
    let {markers, selectedMarkerKey} = s.props.storeState
    return markers.map((marker) =>
      <Marker markerKey={marker.key}
                key={marker.key}
                {...marker.location}
                dynamic={marker.dynamic}
                markerName={marker.name}
                type={marker.type}
                selected={selectedMarkerKey === marker.key}
                />
    )
  },

  renderDronePath () {
    let { dronePath } = this.props.storeState
    return dronePath.map((past, i) => {
      if (i < dronePath.length - 1) {
        return <MarkerFootprint
                  key={past.timestamp}
                  lat={past.lat}
                  lng={past.lng}
                  />
      } else {
        return null
      }
    }
    )
  },

  onMarkerClick (key) {
    let { dispatch } = this.props
    return co(function * () {
      debug(key)
      dispatch(actions.selectMarkerKey(key))
    })
  },

  putFlag ({x, y, lat, lng, event}) {
    const s = this
    let destination = (
      <DestinationFlag
        style={{ color: s.props.dominantColor }}
        lat={lat}
        lng={lng}
      />
    )
    s.props.dispatch(actions.addDroneLog('目的地をセットしました'))
    s.props.dispatch(actions.setDestination({ lat, lng }))
    this.setState({
      destination
    })
  }
})

// let selectedMarker = utils.getSelectedMarker(state)
const mapStateToProps = (storeState) => ({ storeState })

const mapDispatchToProps = (dispatch) => ({ dispatch })

ControllerMap = connect(mapStateToProps, mapDispatchToProps)(ControllerMap)

export default ControllerMap
