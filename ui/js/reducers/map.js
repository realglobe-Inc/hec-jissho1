/**
 * Reducer of map
 */
let initailState = {
  center: {
    lat: 0,
    lng: 0
  }
}
const map = (state = initailState, action) => {
  switch (action.type) {
    case 'CHANGE_MAP_CENTER':
      return Object.assign({}, state, {
        center: {
          lat: action.lat,
          lng: action.lng
        }
      })
    default:
      return state
  }
}

export default map
