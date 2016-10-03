/**
 * Reducer of selected spot
 */
const selectedMarkerKey = (state = null, action) => {
  switch (action.type) {
    case 'SELECT_ACTOR_KEY':
      return action.key
    default:
      return state
  }
}

export default selectedMarkerKey
