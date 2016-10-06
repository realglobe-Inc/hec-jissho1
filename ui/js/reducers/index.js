/**
The top level reducer.
State shape is below.
{
  markers [
    {
      key: 'drone-01',
      type: 'drone',
      name: 'Drone 01',
      location: {
        lat: 30.821421, lng: 34.398242
      },
      dynamic: true,
      custom: {}
    }
  ]
  selectedMarkerKey: 'drone-01',
  dominantColor: '#5ff',
  map: {
    center: { lat, lng }
  },
  modal_window: {
    'some-modal-key': false
  },
  reports: [
    {
      date: Tue Sep 27 2016 14:43:07 GMT+0900 (JST)
      deviceId: "hitoe-01"
      deviceName: "Android"
      id: 1
      info: "調子が悪い"
      lat: 35.71054
      lng: 139.76389
      reportId: "report-01"
    }
  ]
}
*/

import { combineReducers } from 'redux'
import markers from './markers'
import dominantColor from './dominant_color'
import map from './map'
import modalWindow from './modal_window'
import selectedMarkerKey from './selected_marker_key'
import reports from './reports'
import warningDisplay from './warning_display'

const Reducer = combineReducers({
  // actors,
  markers,
  dominantColor,
  map,
  modalWindow,
  selectedMarkerKey,
  reports,
  warningDisplay
})

export default Reducer
