import dominantColor from './dominant_color'
import changeMapCenter from './map'
import markers from './markers'
import modalWindow from './modal_window'
import selectMarkerKey from './select_marker_key'
import droneActor from './drone_actor'
import droneState from './drone_state'
import addDroneLog from './drone_log'
import dronePath from './drone_path'
import reports from './reports.js'

const actions = Object.assign(
  {},
  droneActor,
  droneState,
  dronePath,
  reports,
  markers,
  {
    addDroneLog,
    changeMapCenter,
    dominantColor,
    modalWindow,
    selectMarkerKey
  }
)

export default actions
