import React, { PropTypes as types } from 'react'
import { connect } from 'react-redux'
import actions from '../actions'

const debug = require('debug')('hec:controller-panel-select')

let ControllerPanelSelect = React.createClass({
  propTypes: {
    dispatch: types.func,
    storeState: types.object
  },

  render () {
    const s = this
    let {props} = s
    let {storeState} = props
    let {markers, selectedMarkerKey} = storeState
    return (
      <div className='controller-panel-select'>
        {markers.map(marker =>
          (
            <div className={'controller-panel-item' + (marker.key === selectedMarkerKey ? ' controller-panel-item-selected' : '')}
                 key={marker.key}
                 onClick={s.selectMarker}
                 data={marker.key}>
              {marker.name}
            </div>
          )
        )}
      </div>
    )
  },

  selectMarker (e) {
    const s = this
    let {storeState, dispatch} = s.props
    let key = e.target.attributes.data.value
    dispatch(actions.selectMarkerKey(key))
    let marker = storeState.markers.find(marker => key === marker.key)
    dispatch(actions.changeMapCenter(marker.location))
  }
})

const mapStateToProps = (storeState) => ({ storeState })
const mapDispatchToProps = (dispatch) => ({ dispatch })

ControllerPanelSelect = connect(
  mapStateToProps,
  mapDispatchToProps
)(ControllerPanelSelect)

export default ControllerPanelSelect
