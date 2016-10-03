const setMarkers = (markers) => {
  return {
    type: 'SET_MARKERS',
    markers
  }
}

const addMarker = (marker) => {
  return {
    type: 'ADD_MARKER',
    marker
  }
}

const removeMarker = (key) => {
  return {
    type: 'REMOVE_MARKER',
    key
  }
}

const moveMarker = ({key, location}) => {
  return {
    type: 'MOVE_MARKER',
    key,
    location
  }
}

export default {
  setMarkers,
  addMarker,
  removeMarker,
  moveMarker
}
