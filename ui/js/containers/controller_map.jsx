/**
 * Controller Map
 */
import React, {PropTypes as types} from 'react'
import {connect} from 'react-redux'
import actions from '../actions'
import GoogleMap from 'google-map-react'
import Marker from '../components/marker'
import co from 'co'
import { apiKey } from '../../config'

const debug = require('debug')('hec:ControllerMap')

let ControllerMap = React.createClass({
  propTypes: {
    dispatch: types.func,
    storeState: types.object
  },

  getInitialState () {
    return {}
  },

  render () {
    const s = this
    let {props, state} = s
    let {dispatch, storeState} = props
    let {map} = storeState
    let mapHeight = window.innerHeight - 50 // header-height = 50px
    return (
      <div className='controller-map' id='controller-map' style={{height: `${mapHeight}px`}}>
        <GoogleMap center={map.center}
                   options={s.createMapOptions}
                   defaultZoom={17}
                   bootstrapURLKeys={{key: apiKey}}
                   onChildClick={s.onMarkerClick}
                   onChange={s.dispatchChangeMapCenter}
                   >
          {state.destination}
          {s.renderMarkers()}
        </GoogleMap>
      </div>
    )
  },

  createMapOptions () {
    return {
      styles: [
        {
          stylers: [
            { hue: '#CDDC39' },
            { saturation: -20 }
          ]
        }, {
          featureType: 'road',
          elementType: 'geometry',
          stylers: [
            { lightness: 100 },
            { visibility: 'simplified' }
          ]
        }, {
          featureType: 'road',
          elementType: 'labels',
          stylers: [
            { visibility: 'off' }
          ]
        }
      ]
    }
  },

  dispatchChangeMapCenter ({center}) {
    const s = this
    s.props.dispatch(actions.changeMapCenter(center))
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

  onMarkerClick (key) {
    let { dispatch } = this.props
    return co(function * () {
      debug(key)
      dispatch(actions.selectMarkerKey(key))
    })
  }
})

const mapStateToProps = (storeState) => ({ storeState })

const mapDispatchToProps = (dispatch) => ({ dispatch })

ControllerMap = connect(mapStateToProps, mapDispatchToProps)(ControllerMap)

export default ControllerMap
