/**
 * Style of the whole application.
 */
import React from 'react'
import { ApButtonStyle } from 'apeman-react-button'
import Color from 'color'
import { color } from '../../config'

const debug = require('debug')('hec:components:app_style')

const AppStyle = React.createClass({
  render () {
    let style = `

.app-theme-color {
  color: ${color}
}
.app-theme-dark-color {
  color: ${Color(color).darken(0.3).hslString()}
}
.app-theme-background-color {
  background-color: ${color}
}

`
    return (
      <div className='app_style'>
        <style type='text/css'>
          {style}
        </style>
        <ApButtonStyle highlightColor={color} />
      </div>
    )
  }
})

export default AppStyle
