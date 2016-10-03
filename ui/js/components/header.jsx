/**
 * Site Header
 */
import React from 'react'
import classnames from 'classnames'
import pkg from '../../../package.json'

const Header = React.createClass({
  render () {
    return (
      <div className={classnames('header', 'app-theme-background-color')}>
        <h1>hec2　v{pkg.version}</h1>
      </div>
    )
  }
})

export default Header
