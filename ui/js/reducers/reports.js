/**
 * Reducer of reports
 */
const reports = (state = [], action) => {
  switch (action.type) {
    case 'FETCH_ALL_REPORTS':
      return action.reports
    case 'ADD_REPORT':
      return state.concat(action.report) // 最新の通報が最後尾
    /* すべての通報をクローズする */
    case 'CLEAR_REPORTS':
      return []
    default:
      return state
  }
}

export default reports
