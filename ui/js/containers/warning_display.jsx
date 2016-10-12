import React from 'react'
import reactUtil from '../utils/react_util'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

const debug = require('debug')('hec:WarningDisplay')

const WarningDisplay = reactUtil.createReduxClass({
  render () {
    const s = this
    let {warningDisplay} = s.props.storeState
    let item = warningDisplay ? s.displayElement() : []
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
        通 報
      </div>
    )
  }
})

export default WarningDisplay
