/**
 * Reducer of map
 */
const {mapCenter} = require('../../config')

let initailState = {
  center: mapCenter
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
