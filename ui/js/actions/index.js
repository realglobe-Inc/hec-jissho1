import dominantColor from './dominant_color'
import changeMapCenter from './map'
import markers from './markers'
import modalWindow from './modal_window'
import toggleWarningDisplay from './warning_display'
import selectMarkerKey from './select_marker_key'
import reports from './reports'
import reportClosed from './report_closed'

const actions = Object.assign(
  {},
  reports,
  reportClosed,
  markers,
  modalWindow,
  {
    changeMapCenter,
    dominantColor,
    selectMarkerKey,
    toggleWarningDisplay
  }
)

export default actions
