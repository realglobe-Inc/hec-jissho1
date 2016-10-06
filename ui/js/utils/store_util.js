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
    // 末尾が最新
    if (!this.hasOpenReport(state)) {
      return null
    }
    let {reports} = state
    return reports[reports.length - 1]
  },
  getFirstReport (state) {
    // 先頭が最初
    if (!this.hasOpenReport(state)) {
      return null
    }
    let {reports} = state
    return reports[0]
  },
  hasOpenReport (state) {
    return state.reports.length > 0
  },
  // なし | Open | Closed
  getReportStatus (state) {
    let hasOpen = this.hasOpenReport(state)
    if (hasOpen) {
      return 'OPEN'
    }
    let {reportClosed} = state
    if (reportClosed) {
      return 'CLOSED'
    }
    return 'NO'
  }
}
