/**
 * Reducer of a drone state
 */
import { INITIAL, PREPARING, PREPARED, MOVING } from '../constants/drone_mode'
import assert from 'assert'

let initialMode = () => ({
  mode: INITIAL,
  key: null,
  destination: null
})
let preparingMode = (key) => ({
  mode: PREPARING,
  key: key,
  destination: null
})
let preparedMode = (key, destination) => ({
  mode: PREPARED,
  key,
  destination
})
let movingMode = (key, destination) => ({
  mode: MOVING,
  key,
  destination
})
let validateMode = (mode, validModes) => {
  assert.ok(validModes.includes(mode), 'Invalid mode state transitin')
}

const droneState = (state = initialMode(), action) => {
  switch (action.type) {
    case 'START_SETTING_DESTINATION':
      validateMode(state.mode, [INITIAL, PREPARED])
      return preparingMode(action.key)
    case 'CANCEL_SETTING_DESTINATION':
      validateMode(state.mode, [PREPARING])
      return initialMode()
    case 'SET_DESITINATION':
      validateMode(state.mode, [PREPARING])
      return preparedMode(state.key, action.destination)
    case 'CANCEL_DESTINATION':
      validateMode(state.mode, [PREPARED])
      return initialMode()
    case 'START_MOVING':
      validateMode(state.mode, [PREPARED])
      return movingMode(state.key, state.destination)
    case 'ABORT_MOVING':
      validateMode(state.mode, [MOVING])
      return preparedMode(state.key, state.destination)
    case 'FINISH_MOVING':
      validateMode(state.mode, [MOVING])
      return initialMode()
    default:
      return state
  }
}

export default droneState
