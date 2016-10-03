/**
 * Reducer of drone path
 */
const dronePath = (state = [], action) => {
  switch (action.type) {
    case 'ADD_DRONE_PATH':
      {
        let {lat, lng, timestamp} = action
        return state.concat({
          lat, lng, timestamp
        })
      }
    case 'CLEAR_DRONE_PATH':
      return []
    default:
      return state
  }
}

export default dronePath
