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
    let {reports} = state
    if (reports.length === 0) {
      return null
    }
    let latest = reports.reduce((prev, report) => {
      return prev.date < report.date ? report : prev
    }, {date: new Date(0)})
    return latest
  }
}
