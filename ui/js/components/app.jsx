/**
 * Application component.
 */
import React from 'react'
import AppStyle from '../components/app_style'
import Header from './header'
import SectionMapController from './section_map_controller'
import ConfirmCloseReportWindow from '../containers/confirm_close_report_window'
import OkWarningWindow from '../containers/ok_warning_window'
import WarningDisplay from '../containers/warning_display'

const App = React.createClass({
  render () {
    return (
      <div className='app'>
        <AppStyle/>
        <Header/>
        <SectionMapController />
        <OkWarningWindow/>
        <ConfirmCloseReportWindow/>
      </div>
    )
  }
})

export default App
