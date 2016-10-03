import React from 'react'
import {connect} from 'react-redux'
import AreaDrone from './area_drone'
import storeUtil from '../utils/store_util'
import appUtil from '../utils/app_util'

const debug = require('debug')('hec:ControllerPanelArea')

let ControllerPanelArea = React.createClass({
  propTypes: {
    content: React.PropTypes.object
  },

  render () {
    const s = this
    let {props} = s
    let {content} = props
    return (
      <div className='controller-panel-area'>
        <div className='title'>
          Information
        </div>
        <div className='content'>
          {content}
        </div>
      </div>
    )
  }
})

const mapStateToProps = (state, ownProp) => {
  let marker = storeUtil.getSelectedMarker(state)
  if (!marker) {
    let content = <h3>Not selected</h3>
    return { content }
  }
  switch (marker.type) {
    case 'drone':
      return { content: <AreaDrone/> }
    case 'report':
      let report = storeUtil.getLatestReport(state)
      return { content: (
        <div className='area-report'>
          <h4>最新の通報</h4>
          <ul>
            <li>通報時間: {appUtil.formatTime(report.date)}</li>
            <li>情報: {report.info}</li>
          </ul>
        </div>
      ) }
    default:
      return { content: <h4>{marker.name}</h4> }
  }
}

ControllerPanelArea = connect(mapStateToProps)(ControllerPanelArea)

export default ControllerPanelArea
