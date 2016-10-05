import React from 'react'
import {connect} from 'react-redux'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

const debug = require('debug')('hec:WarningDisplay')

let WarningDisplay = React.createClass({
  render () {
    const s = this
    let {warningDisplay} = s.props
    debug(warningDisplay)
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

const mapStateToProps = (state, ownProp) => {
  let {warningDisplay} = state
  return {
    warningDisplay
  }
}

WarningDisplay = connect(mapStateToProps)(WarningDisplay)

export default WarningDisplay
