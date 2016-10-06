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
  infoDisplay: true,
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
  ],
  reportClosed: null or object
}
*/

import { combineReducers } from 'redux'
import dominantColor from './dominant_color'
import infoDisplay from './info_display'
import markers from './markers'
import map from './map'
import modalWindow from './modal_window'
import selectedMarkerKey from './selected_marker_key'
import reports from './reports'
import reportClosed from './report_closed'
import warningDisplay from './warning_display'

const Reducer = combineReducers({
  dominantColor,
  infoDisplay,
  markers,
  map,
  modalWindow,
  selectedMarkerKey,
  reports,
  reportClosed,
  warningDisplay
})

export default Reducer
