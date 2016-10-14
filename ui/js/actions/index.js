import dominantColor from './dominant_color'
import changeMapCenter from './map'
import hitoeCallers from './hitoe_callers'
import infoDisplay from './info_display'
import markers from './markers'
import modalWindow from './modal_window'
import selectMarkerKey from './select_marker_key'
import reports from './reports'
import reportClosed from './report_closed'

const actions = Object.assign(
  {},
  hitoeCallers,
  infoDisplay,
  reports,
  reportClosed,
  markers,
  modalWindow,
  {
    changeMapCenter,
    dominantColor,
    selectMarkerKey
  }
)

export default actions
