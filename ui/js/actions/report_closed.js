import storeUtil from '../utils/store_util'
import co from 'co'

/**
 * state.reports から計算して、時間を付与しておく。
 * reports をクリアする前に実行するべき。
 */
const setClosedReport = (actorKey) => (dispatch, getState) => co(function * () {
  let state = getState()
  let first = storeUtil.getFirstReport({state, actorKey})
  let ms = new Date() - first.date // ミリ秒
  let report = Object.assign({
    /* クローズするまでの秒数 */
    closeSeconds: Math.floor(ms / 1000)
  }, first)
  dispatch({
    type: 'SET_CLOSED_REPORT',
    report
  })
})

const clearClosedReport = () => {
  return {
    type: 'CLEAR_CLOSED_REPORT'
  }
}

export default {
  setClosedReport,
  clearClosedReport
}
