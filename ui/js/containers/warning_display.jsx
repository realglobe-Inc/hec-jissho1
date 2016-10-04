import React from 'react'
import {connect} from 'react-redux'

const debug = require('debug')('hec:WarningDisplay')

let WarningDisplay = React.createClass({
  render () {
    const s = this
    let {warningDisplay} = s.props
    debug(warningDisplay)
    return (
      <div className={warningDisplay ? 'warning-display' : 'warning-display-hidden'}></div>
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
