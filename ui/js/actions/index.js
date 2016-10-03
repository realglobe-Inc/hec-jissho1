import dominantColor from './dominant_color'
import changeMapCenter from './map'
import markers from './markers'
import modalWindow from './modal_window'
import selectMarkerKey from './select_marker_key'
import reports from './reports.js'

const actions = Object.assign(
  {},
  reports,
  markers,
  {
    changeMapCenter,
    dominantColor,
    modalWindow,
    selectMarkerKey
  }
)

export default actions
