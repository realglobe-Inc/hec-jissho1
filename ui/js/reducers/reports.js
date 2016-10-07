const {copy} = require('../utils/js_util')
const assert = require('assert')

assert.ok(copy)

/**
 * Reducer of reports
 */
const reports = (state = {}, action) => {
  switch (action.type) {
    case 'FETCH_ALL_REPORTS':
      assert.ok(action.reports)
      return action.reports
    /* actorKey で指定した通報を追加する */
    case 'ADD_REPORT':
      {
        let {report} = action
        let {actorKey} = report
        assert.ok(actorKey, `Actor key not defined: ${actorKey}`)
        let reportList = state[actorKey] || []
        let nextList = reportList.concat(action.report)
        let next = Object.assign(
          copy(state),
          { [actorKey]: nextList }
        )
        return next
      }
    /* actorKey で指定した通報リストを消去する */
    case 'CLEAR_REPORTS':
      {
        let {actorKey} = action
        assert.ok(actorKey, `Actor key not defined: ${actorKey}`)
        let next = copy(state)
        delete next[actorKey]
        return next
      }
    default:
      return state
  }
}

export default reports
