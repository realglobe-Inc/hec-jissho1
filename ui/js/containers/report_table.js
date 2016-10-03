import React from 'react'
import {connect} from 'react-redux'
import appUtil from '../utils/app_util'

const debug = require('debug')('hec:ReportTable')

let ReportTable = React.createClass({
  propTypes: {
    reports: React.PropTypes.array
  },

  render () {
    const s = this
    let {reports} = s.props
    if (reports.length === 0) {
      return (
        <div className='no-report'>通報はありません</div>
      )
    } else {
      return (
        <table className='report-list'>
          <thead>
            <tr>
              <td>通報時刻</td>
              <td>通報ID</td>
              <td>デバイス</td>
              <td>情報</td>
            </tr>
          </thead>
          <tbody>
            {reports.map((report, i) => {
              return (
                <tr key={i}>
                  <td>{appUtil.formatTime(report.date)} <span style={{color: 'red'}}>{i === 0 ? 'new!' : ''}</span></td>
                  <td>{report.reportId}</td>
                  <td>{report.deviceName}</td>
                  <td>{report.info}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      )
    }
  }
})

const mapStateToProps = (state) => {
  return {
    reports: state.reports
  }
}

ReportTable = connect(mapStateToProps)(ReportTable)

export default ReportTable
