/**
 * caller の接続・切断処理は別のところでする
 */

const addHitoeCaller = ({key, caller}) => {
  return {
    type: 'ADD_HITOE_CALLER',
    key,
    caller
  }
}

const removeHitoeCaller = (key) => {
  return {
    type: 'REMOVE_HITOE_CALLER',
    key
  }
}

export default {
  addHitoeCaller,
  removeHitoeCaller
}
