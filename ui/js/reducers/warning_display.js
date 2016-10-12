/**
 * 警報画面の表示／非表示
 */
let initial = {
  /* 「警告」の表示 */
  display: false,
  /* warning プロセス実行中 */
  nowWarning: false,
  /* warning 関数 */
  warningFunc: null
}
const warningDisplay = (state = initial, action) => {
  switch (action.type) {
    case 'TOGGLE_WARNING_DISPLAY':
      {
        let {display, nowWarning, warningFunc} = state
        return {
          display: !display,
          nowWarning,
          warningFunc
        }
      }
    case 'OFF_WARNING':
      {
        let {warningFunc} = state
        clearTimeout(warningFunc)
        return {
          display: false,
          nowWarning: false,
          warningFunc: null
        }
      }
    case 'START_WARNING':
      {
        return {
          display: true,
          nowWarning: true,
          warningFunc: action.warningFunc
        }
      }
    default:
      return state
  }
}

export default warningDisplay
