/**
 * Application component.
 */
import React from 'react'
import AppStyle from '../components/app_style'
import Header from './header'
import SectionMapController from './section_map_controller'
import SectionReport from './section_report'

const App = React.createClass({
  render () {
    return (
      <div className='app'>
        <AppStyle/>
        <Header/>
        <SectionMapController />
        <SectionReport />
      </div>
    )
  }
})

export default App
