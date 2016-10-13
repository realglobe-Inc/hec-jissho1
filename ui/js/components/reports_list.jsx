/**
 * Closed reports list component.
 * Used in entries/reports.jsx
 */
import React from 'react'
import co from 'co'
import { request } from '../utils/js_util'
import urls from '../utils/urls'

const ReportsList = React.createClass({
  getInitialState () {
    return {
      reports: []
    }
  },
  render () {
    const s = this
    return (
      <div className='reports-list-wrapper'>
        <h2 className='title'>対応済み通報一覧</h2>
        {s.renderTable()}
      </div>
    )
  },

  componentWillMount () {
    const s = this
    return co(function * () {
      let reports = yield request({
        method: 'GET',
        url: urls.closedReports(),
        json: true
      })
      s.setState({ reports })
    })
  },

  renderTable () {
    const s = this
    let {reports} = s.state
    if (reports.length === 0) {
      return <div className='no-report'>通報はありません</div>
    } else {
      return (
        <table className='report-list'>
          <thead>
            <tr>
              <td>通報ID</td>
              <td>通報時刻</td>
              <td>クローズ時刻</td>
              <td>クローズまでの時間</td>
            </tr>
          </thead>
          <tbody>
            {reports.map((report, i) => {
              let firstReportDate = new Date(report.first_report_date)
              let closedDate = new Date(report.closed_date)
              let timeScore = Math.floor((closedDate - firstReportDate) / 1000)
              return (
                <tr key={i}>
                  <td>{report.report_full_id}</td>
                  <td>{firstReportDate.toLocaleString()}</td>
                  <td>{closedDate.toLocaleString()}</td>
                  <td>{timeScore} 秒</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      )
    }
  }
})

export default ReportsList
