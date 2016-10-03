/**
The top level reducer.
State shape is below.
{
  // actors: [
  //   {
  //     key: 'drone-01',
  //     type: 'drone',
  //     name: 'Drone 01',
  //     location: {
  //       lat: 30.821421, lng: 34.398242
  //     },
  //     caller: caller,
  //     dynamic: true,
  //     custom: {}
  //   }
  // ],
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
  modal_window: false,
  droneActor: {// drone actor //}
  droneState: {
    mode: INITIAL || PREPARING || PREPARED || MOVING,
    key: 'drone-01',
    destination: {
      lat: 10,
      lng: 10
    }
  },
  droneLog: [
    {text: 'hoge', color: '#666'}
  ],
  dronePath: [
    {lat, lng}
  ],
  reports: [
    {
      date: Tue Sep 27 2016 14:43:07 GMT+0900 (JST)
      deviceId: "android-01"
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
// import actors from './actors'
import markers from './markers'
import dominantColor from './dominant_color'
import map from './map'
import modalWindow from './modal_window'
import selectedMarkerKey from './selected_marker_key'
import droneActor from './drone_actor'
import droneState from './drone_state'
import droneLog from './drone_log'
import dronePath from './drone_path'
import reports from './reports'

const Reducer = combineReducers({
  // actors,
  markers,
  dominantColor,
  droneActor,
  droneState,
  droneLog,
  dronePath,
  map,
  modalWindow,
  selectedMarkerKey,
  reports
})

export default Reducer
