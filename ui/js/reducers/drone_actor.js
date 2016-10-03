const droneActor = (state = {}, action) => {
  switch (action.type) {
    case 'SET_DRONE_ACTOR':
      return action.drone
    default:
      return state
  }
}

export default droneActor
