/**
 * Reducer of drone log
 */
const droneLog = (state = [], action) => {
  switch (action.type) {
    case 'ADD_LOG':
      return state.concat({
        text: action.text,
        color: action.color
      })
    default:
      return state
  }
}

export default droneLog
