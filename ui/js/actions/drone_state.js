/**
 * Action of drone state
 */

const startSettingDestination = (key) => {
  return {
    type: 'START_SETTING_DESTINATION',
    key
  }
}

const cancelSettingDestination = (key) => {
  return {
    type: 'CANCEL_SETTING_DESTINATION'
  }
}

const setDestination = (destination) => {
  return {
    type: 'SET_DESITINATION',
    destination
  }
}

const cancelDestination = () => {
  return {
    type: 'CANCEL_DESTINATION'
  }
}

const startMoving = () => {
  return {
    type: 'START_MOVING'
  }
}

const abortMoving = () => {
  return {
    type: 'ABORT_MOVING'
  }
}

const finishMoving = () => {
  return {
    type: 'FINISH_MOVING'
  }
}

export default {
  startSettingDestination,
  cancelSettingDestination,
  setDestination,
  cancelDestination,
  startMoving,
  abortMoving,
  finishMoving
}
