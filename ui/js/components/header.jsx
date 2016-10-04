/**
 * Site Header
 */
import React from 'react'
import classnames from 'classnames'
import Watch from './watch'

const Header = React.createClass({
  render () {
    return (
      <div className={classnames('header', 'app-theme-background-color')}>
        <h1>緊急通報システム リファレンスモデル</h1>
        <Watch/>
      </div>
    )
  }
})

export default Header
