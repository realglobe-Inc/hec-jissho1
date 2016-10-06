/**
 * 警報画面の表示／非表示
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
