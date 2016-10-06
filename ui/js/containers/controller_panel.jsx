/**
 * Controller panel
 */
import React, {PropTypes as types} from 'react'
import {connect} from 'react-redux'
import ControllerPanelArea from '../containers/controller_panel_area'
import ControllerPanelSelect from '../containers/controller_panel_select'
import actions from '../actions'
import c from 'classnames'

const debug = require('debug')('hec:ControllerPanel')

let ControllerPanel = React.createClass({
  propTypes: {
    dispatch: types.func,
    storeState: types.object
  },
  render () {
    const s = this
    let display = s.props.storeState.infoDisplay
    let width = 400 // See controller-panel.scss $panel-width
    let displayStyle = display ? {} : {left: `-${width}px`}
    return (
      <div className='controller-panel' style={displayStyle}>
        <div className='panel-display-toggle'>
          <i className={c('fa', 'fa-3x', display ? 'fa-caret-left' : 'fa-caret-right')} aria-hidden></i>
          <div className='expand' onClick={s.toggleDisplay}></div>
        </div>
        <ControllerPanelSelect/>
        <ControllerPanelArea/>
      </div>
    )
  },

  toggleDisplay () {
    debug('toggle')
    this.props.dispatch(actions.toggleInfoDisplay())
  }
})

const mapStateToProps = (storeState) => ({ storeState })
const mapDispatchToProps = (dispatch) => ({ dispatch })

ControllerPanel = connect(mapStateToProps, mapDispatchToProps)(ControllerPanel)

export default ControllerPanel
