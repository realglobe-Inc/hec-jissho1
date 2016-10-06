/**
* 情報欄の表示／非表示
*/

function isSmartPhone () {
  let ua = navigator.userAgent
  return ua.includes('iPhone') || ua.includes('iPad') || ua.includes('iPod') || ua.includes('Android')
}

let initialState = !isSmartPhone()
const infoDisplay = (state = initialState, action) => {
  switch (action.type) {
    case 'TOGGLE_INFO_DISPLAY':
      return !state
    default:
      return state
  }
}

export default infoDisplay
