/**
 * クローズされた通報
 */
const reportClosed = (state = null, action) => {
  switch (action.type) {
    case 'SET_CLOSED_REPORT':
      return action.report
    case 'CLEAR_CLOSED_REPORT':
      return null
    default:
      return state
  }
}

export default reportClosed
