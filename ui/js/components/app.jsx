/**
 * Application component.
 */
import React from 'react'
import AppStyle from '../components/app_style'
import Header from './header'
import SectionMapController from './section_map_controller'
import WarningDisplay from '../containers/warning_display'

const App = React.createClass({
  render () {
    return (
      <div className='app'>
        <AppStyle/>
        <Header/>
        <SectionMapController />
        <WarningDisplay/>
      </div>
    )
  }
})

export default App
