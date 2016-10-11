/**
 * Style of the whole application.
 */
import React from 'react'
import { ApButtonStyle } from 'apeman-react-button'
import { color } from '../../config'

const AppStyle = React.createClass({
  render () {
    return (
      <div className='app_style'>
        <ApButtonStyle highlightColor={color} />
      </div>
    )
  }
})

export default AppStyle
