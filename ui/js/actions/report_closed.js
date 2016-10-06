import storeUtil from '../utils/store_util'

/**
 * state.reports から計算して、時間を付与しておく。
 * reports をクリアする前に実行するべき。
 */
const setClosedReport = () => (dispatch, getState) => {
  let state = getState()
  console.log(state)
  let first = storeUtil.getFirstReport(state)
  let ms = new Date() - first.date // ミリ秒
  let report = Object.assign({
    /* クローズするまでの秒数 */
    closeSeconds: Math.floor(ms / 1000)
  }, first)
  dispatch({
    type: 'SET_CLOSED_REPORT',
    report
  })
}

export default {
  setClosedReport
}
