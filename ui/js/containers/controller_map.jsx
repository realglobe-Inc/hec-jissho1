/**
 * Controller Map
 */
import React, {PropTypes as types} from 'react'
import reactUtil from '../utils/react_util'
import actions from '../actions'
import GoogleMap from 'google-map-react'
import Marker from '../components/marker'
import co from 'co'
import { apiKey } from '../../config'
import cssVars from '../../scss/vars.json'

const debug = require('debug')('hec:ControllerMap')

const ControllerMap = reactUtil.createReduxClass({
  getInitialState () {
    return {}
  },

  render () {
    const s = this
    let {props, state} = s
    let {storeState} = props
    let {map} = storeState
    let mapHeight = window.innerHeight - parseInt(cssVars['header-height'], 10)
    return (
      <div className='controller-map' id='controller-map' style={{height: `${mapHeight}px`}}>
        <GoogleMap center={map.center}
                   options={s.createMapOptions}
                   defaultZoom={17}
                   bootstrapURLKeys={{key: apiKey}}
                   onChildClick={s.onMarkerClick}
                   onChange={s.changeCenter}
                   >
          {state.destination}
          {s.renderMarkers()}
        </GoogleMap>
      </div>
    )
  },

  /**
   * Google Map のオプション。ここでスタイルを設定する。
   */
  createMapOptions () {
    return {
      styles: [
        {
          featureType: 'all',
          stylers: [
            { saturation: 40 }
          ]
        }, {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [
            { visibility: 'off' }
          ]
        }
      ]
    }
  },

  changeCenter ({center}) {
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

export default ControllerMap
