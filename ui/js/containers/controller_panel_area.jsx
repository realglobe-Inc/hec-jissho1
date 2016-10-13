import React, { PropTypes as types } from 'react'
import reactUtil from '../utils/react_util'
import storeUtil from '../utils/store_util'
import AreaReport from './area_report'
import {HITOE_ACTORKEY_PREFIX} from '../constants'

const debug = require('debug')('hec:ControllerPanelArea')

// 情報の type
const NOT_SELECTED = 1
const DEFAULT = 2
const OPEN_REPORT = 3
const CLOSED_REPORT = 4

const ControllerPanelArea = reactUtil.createReduxClass({
  render () {
    const s = this
    return (
      <div className='controller-panel-area'>
        <div className='title'>
          通報情報
        </div>
        <div className='content'>
          {s.renderSelectedContent()}
        </div>
      </div>
    )
  },

  renderSelectedContent () {
    const s = this
    let type = s.contentType()
    switch (type) {
      case NOT_SELECTED:
        return (
          <div className='area-no-select'>
            <div>通報が来ると情報が表示されます</div>
          </div>
        )
      case OPEN_REPORT:
        return (
          <AreaReport/>
        )
      case CLOSED_REPORT:
        return (
          <div className='area-no-report'>
            <h4>通報をクローズしました</h4>
            <div><a href='/reports.html'>対応済み通報一覧</a></div>
          </div>
        )
      case DEFAULT:
      default:
        let marker = storeUtil.getSelectedMarker(s.props.storeState)
        return (
          <div className='area'><h4>{marker.name}</h4></div>
        )
    }
  },

  contentType () {
    const s = this
    let actorKey = s.props.storeState.selectedMarkerKey
    let isAnySelected = actorKey.length > 0
    if (!isAnySelected) {
      return NOT_SELECTED
    }
    let isReportSelected = actorKey.startsWith(HITOE_ACTORKEY_PREFIX)
    if (!isReportSelected) {
      return DEFAULT
    }
    let has = storeUtil.hasOpenReport({state: s.props.storeState, actorKey})
    if (has) {
      return OPEN_REPORT
    } else {
      return CLOSED_REPORT
    }
  }
})

export default ControllerPanelArea
