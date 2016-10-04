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
