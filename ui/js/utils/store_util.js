/**
 * Store util functions
 */
export default {
  getSelectedMarker (state) {
    let key = state.selectedMarkerKey
    if (!key) {
      return null
    }
    let marker = state.markers.find(marker => key === marker.key) || null
    return marker
  },
  getLatestReport (state) {
    // let {reports} = state
    // if (reports.length === 0) {
    //   return null
    // }
    // let latest = reports.reduce((prev, report) => {
    //   return prev.date < report.date ? report : prev
    // }, {date: new Date(0)})
    // return latest

    // 末尾が最新
    if (!this.hasReport(state)) {
      return null
    }
    let {reports} = state
    return reports[reports.length - 1]
  },
  getFirstReport (state) {
    // 先頭が最初
    if (!this.hasReport(state)) {
      return null
    }
    let {reports} = state
    return reports[0]
  },
  hasReport (state) {
    return state.reports.length > 0
  }
}
