const addDronePath = ({lat, lng}) => {
  let timestamp = Date.now()
  return {
    type: 'ADD_DRONE_PATH',
    lat, lng, timestamp
  }
}

const clearDronePath = () => {
  return {
    type: 'CLEAR_DRONE_PATH'
  }
}

export default {
  addDronePath,
  clearDronePath
}
