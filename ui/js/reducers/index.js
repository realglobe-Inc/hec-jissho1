/**
The top level reducer.
State shape is below.
{
  markers [
    {
      key: 'drone-01', // marker の key は actor の場合は actorKey
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
  reports: {
    [actorKey]: [
      {
        date: Tue Sep 27 2016 14:43:07 GMT+0900 (JST)
        id: 1
        lat: 35.71054
        lng: 139.76389
        heartRate: 60,
        reportId: 1,
        actorKey: 'qq:hitoe:01',
        reportFullId: 'qq:hitoe:01#1'
      }
    ]
  },
  reportClosed: null or object
}
*/

import { combineReducers } from 'redux'
import dominantColor from './dominant_color'
import hitoeCallers from './hitoe_callers'
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
  hitoeCallers,
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
