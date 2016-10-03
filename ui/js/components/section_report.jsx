/**
 * Report section.
 */
import React from 'react'
import ReportTable from '../containers/report_table'

const SectionReport = React.createClass({
  render () {
    return (
      <div className='section-report-wrapper'>
        <div className='section-report'>
          <h2 className='title'>通報一覧</h2>
          <ReportTable/>
        </div>
      </div>
    )
  }
})

export default SectionReport
