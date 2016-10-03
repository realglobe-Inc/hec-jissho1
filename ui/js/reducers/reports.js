/**
 * Reducer of reports
 */
const reports = (state = [], action) => {
  switch (action.type) {
    case 'FETCH_ALL_REPORTS':
      return action.reports
    case 'ADD_REPORT':
      return [action.report].concat(state)
    default:
      return state
  }
}

export default reports
