/**
 * Reducer of the state of display the Pong modal window.
 */
const {MODAL} = require('../constants')

let initialState = {
  [MODAL.CONFIRM_CLOSE]: false
}
const modalWindow = (state = initialState, {type, key}) => {
  switch (type) {
    case 'TOGGLE_MODAL_DISPLAY':
      let next = Object.assign({}, state)
      next[key] = !state[key]
      return next
    default:
      return state
  }
}

export default modalWindow
