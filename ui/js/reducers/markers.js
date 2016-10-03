const markers = (state = [], action) => {
  switch (action.type) {
    case 'SET_MARKERS':
      return action.markers
    case 'ADD_MARKER':
      return state.concat(action.marker)
    case 'REMOVE_MARKER':
      return state.filter((marker) => marker.key !== action.key)
    case 'MOVE_MARKER':
      {
        let markerIndex = state.findIndex(marker => marker.key === action.key)
        if (markerIndex === -1) {
          return state
        }
        let marker = Object.assign({}, state[markerIndex])
        let {location} = action
        marker.location = location
        let markers = [].concat(state)
        markers[markerIndex] = marker
        return markers
      }
    default:
      return state
  }
}

export default markers
