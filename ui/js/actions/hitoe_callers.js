/**
 * caller の接続・切断処理は別のところでする
 */

const addHitoeCaller = ({key, hitoe}) => {
  return {
    type: 'ADD_HITOE_CALLER',
    key,
    hitoe
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
