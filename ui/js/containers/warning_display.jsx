import React from 'react'
import reactUtil from '../utils/react_util'
import actions from '../actions'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

const debug = require('debug')('hec:WarningDisplay')

const WarningDisplay = reactUtil.createReduxClass({
  render () {
    const s = this
    let {display} = s.props.storeState.warningDisplay
    let item = display ? s.displayElement() : []
    return (
      <ReactCSSTransitionGroup
        transitionName='warning'
        transitionEnterTimeout={0}
        transitionLeaveTimeout={0}
        >
        {item}
      </ReactCSSTransitionGroup>
    )
  },

  displayElement () {
    return (
      <div className='warning-display' key='1'>
       {/* 赤い画面 */}
      </div>
    )
  }
})

export default WarningDisplay
