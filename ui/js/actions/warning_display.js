/**
 * Action of modal window.
 */
const toggleWarningDisplay = () => {
  return {
    type: 'TOGGLE_WARNING_DISPLAY'
  }
}

const stopWarning = () => {
  return {
    type: 'OFF_WARNING'
  }
}

const startWarning = (warningFunc) => {
  return {
    type: 'START_WARNING',
    warningFunc
  }
}

export default {
  toggleWarningDisplay,
  stopWarning,
  startWarning
}
