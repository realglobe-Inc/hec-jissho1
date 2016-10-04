/**
 * Reducer of the state of display the Pong modal window.
 */
const warningDisplay = (state = false, action) => {
  switch (action.type) {
    case 'TOGGLE_WARNING_DISPLAY':
      return !state
    default:
      return state
  }
}

export default warningDisplay
